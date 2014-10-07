# Copyright 2011-2013 Splunk, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"): you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

from __future__ import absolute_import

from . search_command_internals import ConfigurationSettingsType
from . streaming_command import StreamingCommand
from . search_command import SearchCommand
from . import csv


class ReportingCommand(SearchCommand):
    """ Processes search results and generates a reporting data structure.

    Reporting search commands run as either reduce or map/reduce operations. The
    reduce part runs on a search head and is responsible for processing a single
    chunk of search results to produce the command's reporting data structure.
    The map part is called a streaming preop. It feeds the reduce part with
    partial results and by default runs on the search head and/or one or more
    indexers.

    You must implement a `reduce` method as a generator function that iterates
    over a set of event records and yields a reporting data structure. You may
    implement a `map` method as a generator function that iterates over a set of
    event records and yields `dict` or `list(dict)` instances.

    ##ReportingCommand configuration

    Configure the `map` operation using a Configuration decorator on your
    ReportingCommand.map method. Configure it like you would a StreamingCommand.

    Configure the `reduce` operation using a Configuration decorator on your
    ReportingCommand class.

    [TODO: ReportingCommand configuration highlights]

    """
    #region Methods

    def map(self, records):
        """ TODO: Documentation

        """
        self  # Turns off ide guidance that method may be static
        return NotImplemented

    def reduce(self, records):
        """ TODO: Documentation

        """
        raise NotImplementedError('reduce(self, records)')

    def _execute(self, operation, reader, writer):
        try:
            for record in operation(SearchCommand.records(reader)):
                writer.writerow(record)
        except Exception as e:
            self.logger.error(e)

    def _prepare(self, argv, input_file):
        if len(argv) >= 3 and argv[2] == '__map__':
            ConfigurationSettings = type(self).map.ConfigurationSettings
            operation = self.map
            argv = argv[3:]
        else:
            ConfigurationSettings = type(self).ConfigurationSettings
            operation = self.reduce
            argv = argv[2:]
        if input_file is None:
            reader = None
        else:
            reader = csv.DictReader(input_file)
        return ConfigurationSettings, operation, argv, reader

    #endregion

    #region Types

    class ConfigurationSettings(SearchCommand.ConfigurationSettings):
        """ TODO: Documentation

        """
        #region Properties
        @property
        def clear_required_fields(self):
            """ Specifies whether `required_fields` are the only fields required
            by subsequent commands

            If `True`, `required_fields` are the *only* fields required by
            subsequent commands. If `False`, required_fields are additive to any
            fields that may be required by subsequent commands. In most cases
            `False` is appropriate for streaming commands and `True` is
            appropriate for reporting commands.

            Default: True

            """
            return type(self)._clear_required_fields

        _clear_required_fields = True

        @property
        def requires_preop(self):
            """ TODO: Documentation

            """
            return type(self)._requires_preop

        _requires_preop = False

        @property
        def retainsevents(self):
            """ TODO: Documentation
            """
            return False

        @property
        def streaming(self):
            """ TODO: Documentation

            """
            return False

        @property
        def streaming_preop(self):
            """ TODO: Documentation

            """
            command_line = str(self.command)
            command_name = type(self.command).name
            text = ' '.join([
                command_name, '__map__', command_line[len(command_name) + 1:]])
            return text

        #endregion

        #region Methods

        @classmethod
        def fix_up(cls, command):
            """ Verifies `command` class structure and configures `map` method

            Verifies that `command` derives from `ReportingCommand` and
            overrides `ReportingCommand.reduce`. It then configures
            `command.reduce`, if an overriding implementation of
            `ReportingCommand.reduce` has been provided.

            :param command: `ReportingCommand` class

            Exceptions:
            `TypeError` `command` class is not derived from `ReportingCommand`
            `AttributeError` No `ReportingCommand.reduce` override

            """
            if not issubclass(command, ReportingCommand):
                raise TypeError('%s is not a ReportingCommand' % command)

            if command.reduce == ReportingCommand.reduce:
                raise AttributeError('No ReportingCommand.reduce override')

            f = vars(command)['map']   # Function backing the map method
                # There is no way to add custom attributes to methods. See
                # [Why does setattr fail on a method](http://goo.gl/aiOsqh)
                # for an explanation.

            if f == vars(ReportingCommand)['map']:
                cls._requires_preop = False
                return

            try:
                settings = f._settings
            except AttributeError:
                f.ConfigurationSettings = StreamingCommand.ConfigurationSettings
                return

            # Create new `StreamingCommand.ConfigurationSettings` class

            module = '.'.join([command.__module__, command.__name__, 'map'])
            name = 'ConfigurationSettings'
            bases = (StreamingCommand.ConfigurationSettings,)

            f.ConfigurationSettings = ConfigurationSettingsType(
                module, name, bases, settings)
            del f._settings
            return

        #endregion

    #endregion
