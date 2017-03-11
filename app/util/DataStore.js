/**
 * Created by slako on 17/3/11.
 */

import { ListView } from 'react-native';

export default new ListView.DataSource({ rowHasChanged: (a, b) => (a !== b) });