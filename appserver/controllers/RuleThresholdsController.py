import sys
import os
import datetime
import urllib
import urllib2
import traceback
from urlparse import urlparse
import json
import logging
import tempfile
import re

import cherrypy
import splunk
import splunk.appserver.mrsparkle.controllers as controllers
from splunk.appserver.mrsparkle.lib.decorators import expose_page
from splunk.appserver.mrsparkle.lib.routes import route

logger = logging.getLogger("fraud_monitoring/RuleThresholdsController")

SPLUNK_APP = 'fraud_monitoring'
APP_DIRECTORY = r'/opt/splunk/etc/apps/{splunk_app}'.format(splunk_app = SPLUNK_APP)
LOOKUP_FILE_PATH = os.path.join(APP_DIRECTORY, 'lookups', 'rule_thresholds.csv')
MACROS_FILE_PATH = os.path.join(APP_DIRECTORY, 'default', 'macros.conf')
USER_ACTIONS_PATH = os.path.join(APP_DIRECTORY, 'file_inputs', 'monitor')
SEARCH_NAMES_FILE_PATH = os.path.join(APP_DIRECTORY, 'lookups', 'rule_search_names.csv')
RULE_DESCRIPTIONS_FILE_PATH = os.path.join(APP_DIRECTORY, 'lookups', 'rules.csv')

sys.path.insert(0, os.path.join(APP_DIRECTORY, 'appserver', 'controllers'))
import splunklib.client

start_datetime = datetime.datetime.utcnow()
start_datetime_str = start_datetime.replace(microsecond = 0).isoformat() + '+0000'

def get_service():
	localServerInfo = urlparse(splunk.getLocalServerInfo())
	host, port = localServerInfo.netloc.split(':')
	return splunklib.client.Service(host = host, port = port, scheme = localServerInfo.scheme, owner = '-', app = SPLUNK_APP, token = splunk.getSessionKey())

def read_file_contents(file_path):
	file_contents = []
	with open(file_path) as file_pointer:
		for line in file_pointer:
			file_contents.append(line.strip())
	return file_contents

def write_file_contents(file_path, file_contents):
	with open(file_path, 'wb') as file_pointer:
		if isinstance(file_contents, list):
			for line in file_contents:
				file_pointer.write(line)
				file_pointer.write('\n')
		else:
			file_pointer.write(file_contents)
			file_pointer.write('\n')

def write_threshold_macro_values(rule, macro_definitions = None):
	macros = dict()
	rule_id = rule['id']
	for threshold_key, threshold_info in rule['thresholds'].iteritems():
		threshold_value = threshold_info.get('value')
		if threshold_value is not None:
			macros['[rule_{rule_id}_{threshold_key}]'.format(rule_id = rule_id, threshold_key = threshold_key)] = 'definition = {threshold_value}'.format(threshold_value = threshold_value)

	if len(macros) == 0:
		return

	if macro_definitions is None:
		macro_definitions = read_file_contents(MACROS_FILE_PATH)

	for i in xrange(len(macro_definitions)):
		macro_name = macro_definitions[i]
		macro_definition = macros.get(macro_name)
		if macro_definition is not None:
			macro_definitions[i + 1] = macro_definition
			del macros[macro_name]

	for macro_name, macro_definition in macros.iteritems():
		macro_definitions.append('')
		macro_definitions.append(macro_name)
		macro_definitions.append(macro_definition)

	write_file_contents(MACROS_FILE_PATH, macro_definitions)

def write_threshold_lookup_values(rule, rule_definitions = None):
	rule_id = rule['id']
	rule_thresholds = rule['thresholds']
	to_write = dict()
	for threshold_key, threshold_info in rule_thresholds.iteritems():
		threshold_value = threshold_info.get('value')
		threshold_type = threshold_info.get('type')
		threshold_saved_search = threshold_info.get('saved_search')
		if threshold_type is not None or threshold_value is not None or threshold_saved_search is not None:
			to_write[threshold_key] = '{rule_id},"{threshold_key}"'.format(rule_id = rule_id, threshold_key = threshold_key)

	if len(to_write) == 0:
		return

	if rule_definitions is None:
		rule_definitions = read_file_contents(LOOKUP_FILE_PATH)

	written_rule = {'id': rule_id, 'thresholds': dict()}
	for i in xrange(len(rule_definitions)):
		for threshold_key, threshold_signature in to_write.iteritems():
			if rule_definitions[i].startswith(threshold_signature):
				_, _, threshold_value, threshold_type, threshold_saved_search = rule_definitions[i].split(',"', 4)

				threshold_info = rule_thresholds[threshold_key]

				new_threshold_value = threshold_info.get('value')
				if new_threshold_value is not None:
					threshold_value = new_threshold_value

				new_threshold_type = threshold_info.get('type')
				if new_threshold_type is not None:
					threshold_type = new_threshold_type

				new_threshold_saved_search = threshold_info.get('saved_search')
				if new_threshold_saved_search is not None:
					threshold_saved_search = new_threshold_saved_search

				threshold_value = threshold_value.strip('"')
				threshold_type = threshold_type.strip('"')
				threshold_saved_search = threshold_saved_search.strip('"')

				rule_definitions[i] = '{rule_id},"{threshold_key}","{threshold_value}","{threshold_type}","{threshold_saved_search}"'.format(rule_id = rule_id, threshold_key = threshold_key, threshold_value = threshold_value, threshold_type = threshold_type, threshold_saved_search = threshold_saved_search)

				written_rule['thresholds'][threshold_key] = {'value': threshold_value, 'type': threshold_type, 'saved_search': threshold_saved_search}

				del to_write[threshold_key]
				break
		if len(to_write) == 0:
			break

	for threshold_key in to_write.iterkeys():
		threshold_info = rule_thresholds[threshold_key]
		rule_definitions.append('{rule_id},"{threshold_key}","{threshold_value}","{threshold_type}","{threshold_saved_search}"'.format(rule_id = rule_id, threshold_key = threshold_key, threshold_value = threshold_info['value'], threshold_type = threshold_info['type'], threshold_saved_search = threshold_info['saved_search']))

	write_file_contents(LOOKUP_FILE_PATH, rule_definitions)

	return written_rule

def write_user_actions_values(written_rule, user_id, username):
	if len(written_rule['thresholds']) == 0:
		return
	tmpfile_fd, tmpfile_path = tempfile.mkstemp(prefix = 'user_action_', suffix = '.log', dir = USER_ACTIONS_PATH, text = False)
	with os.fdopen(tmpfile_fd, 'wb') as tmpfile:
		for threshold_key, threshold_info in written_rule['thresholds'].iteritems():
			tmpfile.write('{timestamp} ACTION="Rule threshold changed" RULE_ID="{rule_id}" THRESHOLD="{threshold_key}" VALUE="{threshold_value}" TYPE="{threshold_type}" USER_ID="{user_id}" USERNAME="{username}"\n'.format(timestamp = start_datetime_str, rule_id = written_rule['id'], threshold_key = threshold_key, threshold_value = threshold_info['value'], threshold_type = threshold_info['type'], user_id = user_id, username = username))

def check_threshold_type(threshold_value, threshold_type):
	if threshold_type == 'int':
		int(threshold_value)
	elif threshold_type == 'float':
		float(threshold_value)
	else:
		raise Exception("Wrong threshold type value (threshold_type: '{threshold_type}'). Valid values are int and float".format(threshold_type = threshold_type))

def check_rule_threshold_types(rule, rule_definitions = None):
	rule_id = rule['id']
	rule_thresholds = rule['thresholds']
	to_check = dict()
	for threshold_key, threshold_info in rule_thresholds.iteritems():
		threshold_type = threshold_info.get('type')
		threshold_value = threshold_info.get('value')
		if threshold_type is None or threshold_value is None:
			to_check[threshold_key] = '{rule_id},"{threshold_key}"'.format(rule_id = rule_id, threshold_key = threshold_key)
		else:
			try:
				check_threshold_type(threshold_value, threshold_type)
			except Exception as exc:
				raise Exception("Error while checking threshold type (rule_id: '{rule_id}', threshold_key: '{threshold_key}', threshold_type: '{threshold_type}', threshold_value: '{threshold_value}') ('cause: {cause}')".format(rule_id = rule_id, threshold_key = threshold_key, threshold_type = threshold_type, threshold_value = threshold_value, cause = str(exc)))

	if len(to_check) == 0:
		return

	if rule_definitions is None:
		rule_definitions = read_file_contents(LOOKUP_FILE_PATH)

	for rule_definition in rule_definitions:
		for threshold_key, threshold_signature in to_check.iteritems():
			if rule_definition.startswith(threshold_signature):
				_, _, threshold_value, threshold_type, _ = rule_definition.split(',"', 4)

				threshold_info = rule_thresholds[threshold_key]

				new_threshold_value = threshold_info.get('value')
				if new_threshold_value is not None:
					threshold_value = new_threshold_value

				new_threshold_type = threshold_info.get('type')
				if new_threshold_type is not None:
					threshold_type = new_threshold_type

				threshold_value = threshold_value.strip('"')
				threshold_type = threshold_type.strip('"')

				check_threshold_type(threshold_value, threshold_type)

				del to_check[threshold_key]
				break
		if len(to_check) == 0:
			break

	if len(to_check) > 0:
		raise Exception("Error while checking rule. No type or value info could be found for some thresholds ('{rule}')".format(rule = repr(to_check)))

def run_saved_searches(written_rule, splunk_url, username, session_key):
	for threshold_info in written_rule['thresholds'].itervalues():
		threshold_saved_search = threshold_info['saved_search']
		if threshold_saved_search != "-":
			try:
				request = urllib2.Request(
					'{splunk_url}/servicesNS/{username}/{splunk_app}/search/jobs'.format(splunk_url = splunk_url, username = username, splunk_app = SPLUNK_APP),
					data = urllib.urlencode({'search': '| savedsearch "{threshold_saved_search}"'.format(threshold_saved_search = threshold_saved_search)}),
					headers = {'Authorization': ('Splunk {session_key}'.format(session_key = session_key))}
				)
				urllib2.urlopen(request)
			except Exception as exc:
				raise Exception("Error executing saved search on the REST API (threshold_saved_search: '{threshold_saved_search}') (cause: '{cause}')".format(threshold_saved_search = threshold_saved_search, cause = str(exc)))

def get_rule_search_names(rule_id_to_get = None):
	rule_id_to_search_names = dict()
	with open(SEARCH_NAMES_FILE_PATH) as search_names_file:
		first_line = True
		for line in search_names_file:
			if first_line:
				first_line = False
				continue
			rule_id, search_names = line.split(',"', 1)
			if rule_id_to_get is None:
				rule_id_to_search_names[rule_id] = [search_name.strip() for search_name in search_names.strip().strip('"').split(';')] 
			elif rule_id == rule_id_to_get:
				return [search_name.strip() for search_name in search_names.strip().strip('"').split(';')]
	return rule_id_to_search_names

def get_rule_states(service = None, rule_id_to_search_names = None, errors = None):
	if service is None:
		service = get_service()
	if rule_id_to_search_names is None:
		rule_id_to_search_names = get_rule_search_names()
	
	saved_searches = service.saved_searches
	rule_id_to_state = dict()
	for rule_id, rule_search_names in rule_id_to_search_names.iteritems():
		rule_state = None
		for rule_search_name in rule_search_names:
			try:
				saved_search = saved_searches[rule_search_name]
			except Exception as exc:
				if errors is not None:
					errors.append("Rule search (rule_id: '{rule_id}', rule_search_name: '{rule_search_name}') was not found".format(rule_id = rule_id, rule_search_name = rule_search_name))
				rule_state = None
				break
			try:
				search_disabled = saved_search.disabled
			except Exception as exc:
				if errors is not None:
					errors.append("Rule search (rule_id: '{rule_id}', rule_search_name: '{rule_search_name}') doesn't have the 'disabled' attribute".format(rule_id = rule_id, rule_search_name = rule_search_name))
				rule_state = None
				break
			if search_disabled == '0':
				search_state = True # enabled
			elif search_disabled == '1':
				search_state = False # disabled
			else:
				if errors is not None:
					errors.append("Rule search (rule_id: '{rule_id}', rule_search_name: '{rule_search_name}') has an unexpected 'disabled' attribute value (disabled: '{disabled}').".format(rule_id = rule_id, rule_search_name = rule_search_name, disabled = search_disabled))
				rule_state = None
				break

			if rule_state is None:
				rule_state = search_state
			elif search_state == True and rule_state == False or search_state == False and rule_state == True:
				if errors is not None:
					errors.append("Rule (rule_id: '{rule_id}') isn't conclusively on or off (it varies between searches).".format(rule_id = rule_id))
				rule_state = None
				break
		if rule_state is not None:
			rule_id_to_state[rule_id] = rule_state
	
	return rule_id_to_state

def set_rule_state(rule_id, rule_state, service = None, rule_search_names = None, rule_id_to_search_names = None):
	if rule_state is not True and rule_state is not False:
		raise ValueError("rule_state should be a boolean (got '{rule_state}')".format(rule_state = rule_state))

	if service is None:
		service = get_service()
	if rule_id_to_search_names is not None and rule_search_names is None:
		rule_search_names = rule_id_to_search_names[rule_id]
	elif rule_search_names is None:
		rule_search_names = get_rule_search_names(rule_id_to_get = rule_id)

	saved_searches = service.saved_searches
	for rule_search_name in rule_search_names:
		try:
			saved_search = saved_searches[rule_search_name]
		except Exception as exc:
			raise Exception("Rule search (rule_id: '{rule_id}', rule_search_name: '{rule_search_name}') was not found".format(rule_id = rule_id, rule_search_name = rule_search_name))
		if rule_state:
			disabled = '0'
		else:
			disabled = '1'
		saved_search.update(disabled = disabled)

def get_formatted_rule_descriptions():
	rule_descriptions = dict()
	with open(RULE_DESCRIPTIONS_FILE_PATH) as f:
		first = True
		for line in f:
			if first:
				first = False
				continue
			rule_id, description = line.strip().split(',"', 1)
			rule_descriptions[rule_id] = description.strip('"')
	rule_thresholds = dict()
	with open(LOOKUP_FILE_PATH) as f:
		first = True
		for line in f:
			if first:
				first = False
				continue
			rule_id, threshold_key, threshold_value, _ = line.strip().split(',"', 3)
			thresholds = rule_thresholds.get(rule_id)
			if thresholds is None:
				thresholds = dict()
				rule_thresholds[rule_id] = thresholds
			thresholds[threshold_key.strip('"')] = threshold_value.strip('"')
	for rule_id, rule_description in rule_descriptions.iteritems():
		thresholds = rule_thresholds.get(rule_id)
		if thresholds is not None:
			rule_description = re.sub(r'\$(' + '|'.join(thresholds.iterkeys()) + ')', lambda m: '<strong>' + thresholds[m.group(1)] + '</strong>', rule_description)
		rule_descriptions[rule_id] = '<strong>Rule ' + rule_id + '</strong>: ' + rule_description
	return rule_descriptions

class RuleThresholdsController(controllers.BaseController):
	@route('/:rulethresholds=rulethresholds')
	@expose_page(must_login=True, methods=['POST'])
	def rulethresholds(self, **kwargs):
		try:
			if cherrypy.request.method == 'POST':
				localServerInfo = urlparse(splunk.getLocalServerInfo())
				host, port = localServerInfo.netloc.split(':')
				splunk_url = localServerInfo.scheme + host + ':' + port
				user_id = cherrypy.session['user']['id']
				username = cherrypy.session['user']['name']
				session_key = splunk.getSessionKey()

				rule = json.loads(cherrypy.request.body.read())

				rule_definitions = read_file_contents(LOOKUP_FILE_PATH)
				try:
					check_rule_threshold_types(rule, rule_definitions)
				except Exception as exc:
					raise Exception("Error checking rule (rule: '{rule}') (cause: '{cause}')".format(rule = repr(rule), cause = str(exc)))

				try:
					write_threshold_macro_values(rule)
				except Exception as exc:
					raise Exception("Error updating macros.conf file (cause: '{cause}')".format(cause = str(exc)))

				try:
					written_rule = write_threshold_lookup_values(rule, rule_definitions)
				except Exception as exc:
					raise Exception("Error updating rule_thresholds.csv file (cause: '{cause}')".format(cause = str(exc)))

				if len(written_rule['thresholds']) > 0:
					try:
						write_user_actions_values(written_rule, user_id, username)
					except Exception as exc:
						raise Exception("Error writing user action parameters to file (cause: '{cause}')".format(cause = str(exc)))

					try:
						run_saved_searches(written_rule, splunk_url, username, session_key)
					except Exception as exc:
						raise Exception("Error running saved searches (cause: '{cause}')".format(cause = str(exc)))

				cherrypy.response.status = 200
				return json.dumps({'status': 'OK'})
		except Exception as exc:
			cherrypy.response.status = 500
			logger.exception("Error (traceback.format_exc() = '%s')", traceback.format_exc())
			return json.dumps({'status': 'error', 'message': str(exc)})

	@route('/:rulestate=rulestate')
	@expose_page(must_login=True, methods=['GET', 'POST'])
	def rulestate(self, **kwargs):
		try:
			if cherrypy.request.method == 'GET':
				errors = []
				rule_states = get_rule_states(errors = errors)

				cherrypy.response.status = 200
				return json.dumps({'status': 'OK', 'rule_states': rule_states, 'errors': errors})
			elif cherrypy.request.method == 'POST':
				request = json.loads(cherrypy.request.body.read())
				set_rule_state(rule_id = request['rule_id'], rule_state = request['state'])

				cherrypy.response.status = 200
				return json.dumps({'status': 'OK'})
		except Exception as exc:
			cherrypy.response.status = 500
			logger.exception("Error (traceback.format_exc() = '%s')", traceback.format_exc())
			return json.dumps({'status': 'error', 'message': str(exc)})

	@route('/:getformattedruledescriptions=getformattedruledescriptions')
	@expose_page(must_login=True, methods=['GET'])
	def getformattedruledescriptions(self, **kwargs):
		try:
			if cherrypy.request.method == 'GET':
				cherrypy.response.status = 200
				return json.dumps({'status': 'OK', 'formatted_rule_descriptions': get_formatted_rule_descriptions()})
		except Exception as exc:
			cherrypy.response.status = 500
			logger.exception("Error (traceback.format_exc() = '%s')", traceback.format_exc())
			return json.dumps({'status': 'error', 'message': str(exc)})
