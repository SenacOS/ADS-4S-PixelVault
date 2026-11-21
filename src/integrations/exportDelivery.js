import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { shareJsonFile } from '../domain/jsonExport.mjs';

export async function deliverJson(artifact) {
  return shareJsonFile(artifact, {
    available: Sharing.isAvailableAsync,
    write(value) {
      const file = new File(Paths.cache, value.name);
      file.create({ overwrite: true });
      file.write(value.content);
      return file.uri;
    },
    share: Sharing.shareAsync,
  });
}
