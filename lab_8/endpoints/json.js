import { readJsonBody, sendError, sendJson } from 'http-lab-kit';

export async function json(req, res) {
  const REQUIRED_FIELDS = ['__comment', 'x', 'y', 's', 'm', 'o'];
  let data;
  try {
    data = await readJsonBody(req);
  } catch (err) {
    sendError(res, 'An error occurred while parsing JSON');
    return;
  }

  try {
    REQUIRED_FIELDS.forEach((field) => {
      if (!Object.hasOwn(data, field)) {
        throw new Error(`${field} is not specified`);
      }
    });
  } catch (err) {
    sendError(res, err.message, 400);
    return;
  }

  const response = {
    __comment: 'Answer.Lab 8/10',
    x_plus_y: data.x + data.y,
    concatenation_s_o: data.s + ' ' + data.o.surname + ' ' + data.o.name,
    Length_m: data.m.length,
  };

  sendJson(res, response, 200);
}
