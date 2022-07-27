import { db } from '../../db';
import { nativeTokens } from '../nativeTokens';

const fulfillDB = (tokenList) => {
  db.tokens.bulkPut(tokenList);
  db.nativeTokens.bulkPut(nativeTokens);
};

export default fulfillDB;
