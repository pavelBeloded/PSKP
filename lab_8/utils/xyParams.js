export function xyParams(x, y) {
  if (!x || !y) {
    return { ok: false, error: 'Two params [x, y] are required' };
  }

  const { xNum, yNum } = { xNum: Number(x), yNum: Number(y) };

  if (isNaN(xNum) || isNaN(yNum)) {
    return { ok: false, error: 'Invalid parameter' };
  }

  return {
    ok: true,
    data: {
      sum: x + y,
      sub: x - y,
      prod: x * y,
      div: x / y,
    },
  };
}
