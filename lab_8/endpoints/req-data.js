import { sendError, sendJson } from 'http-lab-kit';

export function req_data(req, res) {
  const totalBytes = parseInt(req.headers['content-length'], 10);

  if (!totalBytes || isNaN(totalBytes)) {
    sendError(res, 'Error: Header Content-Length is not specified', 400);
    return;
  }

  let receivedBytes = 0;
  let chunkCount = 0;

  console.log(
    'Loading started. Size for download: ' + (totalBytes / 1024 / 1024).toFixed(2) + ' MB'
  );

  req.on('data', (chunk) => {
    chunkCount++;
    receivedBytes += chunk.length;

    const progress = ((receivedBytes / totalBytes) * 100).toFixed(1);

    const barWidth = 20;
    const filledWidth = Math.round((receivedBytes / totalBytes) * barWidth);
    const progressBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);

    process.stdout.write(
      `\r[${progressBar}] ${progress}% | received ${(receivedBytes / 1024).toFixed(1)}%]`
    );
  });

  req.on('end', () => {
    console.log('Loaded successfully!');

    sendJson(res, {
      ok: true,
      message: 'Successfully received',
      total_bytes_received: receivedBytes,
    });
  });
}
