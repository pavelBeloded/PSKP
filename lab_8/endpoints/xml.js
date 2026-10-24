import { readBody } from 'http-lab-kit';
import { parseStringPromise, Builder } from 'xml2js';

let currId = 1;

export async function xml(req, res) {
  const raw = await readBody(req);

  const data = await parseStringPromise(raw);

  const resData = { response: {} };

  resData.response.$ = { id: currId++, request: data.request.$.id };
  resData.response.sum = {
    $: {
      element: 'x',
      result: data.request.x.reduce((acc, current) => acc + Number(current.$.value), 0),
    },
  };

  resData.response.concat = {
    $: {
      element: 'm',
      result: data.request.m.map((el) => el.$.value).join(''),
    },
  };

  const body = new Builder().buildObject(resData);

  res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
  res.end(body);
}
