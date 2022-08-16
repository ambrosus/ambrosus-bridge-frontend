import { db } from '../../db';
import { nativeTokens } from '../nativeTokens';

const fulfillDB = (tokenList) => {
  db.tokens.clear();
  db.tokens.bulkPut(tokenList);
  db.nativeTokens.bulkPut(nativeTokens);
};

export default fulfillDB;
