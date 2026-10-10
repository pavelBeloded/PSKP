import { sendError, sendJson } from 'http-lab-kit';
import { xyParams } from '../utils/xyParams.js';

export function parameterQ(res, url) {
  const { x, y } = Object.fromEntries(url.searchParams);

  const result = xyParams(x, y);

  if (!result.ok) {
    sendError(res, result.error, 400);
    return;
  }

  sendJson(res, result.data, 200);
}
