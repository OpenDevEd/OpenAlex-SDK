import axios from 'axios';

export async function GET(url: string, headers: any = {}) {
  let res = await axios.get(url, { headers });
  const retryHttpCodes: number[] = [429, 500, 502, 503, 504];
  const retryAfter = 5;
  const maxRetries = 5;
  let retries = 0;
  while (retryHttpCodes.includes(res.status) && retries < maxRetries) {
    console.log(`Retrying GET request to ${url} in ${retryAfter} seconds`);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    res = await axios.get(url, { headers });
    retries += 1;
  }
  if (retries === maxRetries) {
    throw new Error('Max retries reached');
  }
  return res;
}

export async function POST(url: string, data: any, headers: any = {}) {
  return await axios.post(url, data, { headers });
}

module.exports = { GET, POST };
