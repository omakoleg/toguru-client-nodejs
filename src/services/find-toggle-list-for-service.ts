import { get } from 'lodash';
import { Toggle, ToguruData } from '../types/toguru';

const toggleBelongsToService = (serviceName: string) => (toggle: Toggle) =>
  [
    ...get(toggle, 'tags.service', '').split(','),
    ...get(toggle, 'tags.services', '').split(',')
  ].includes(serviceName);

export default (toguruData: ToguruData, service: string): string[] =>
  (get(toguruData, 'toggles', []) as ToguruData['toggles'])
    .filter(toggleBelongsToService(service))
    .map(t => t.id);
