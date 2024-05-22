import axios from 'axios';

export async function GET(url: string, headers: any = {}) {
  const retryHttpCodes: number[] = [429, 500, 502, 503, 504];
  const retryAfter = 1;
  const maxRetries = 5;
  let retries = 0;
  let res;

  while (retries < maxRetries) {
    try {
      res = await axios.get(url, { headers });
      if (!retryHttpCodes.includes(res.status)) {
        return res;
      }
    } catch (error) {
      console.log(`Error fetching ${url}: ${error}`);
      if (!retryHttpCodes.includes(error.response.status)) {
        return error;
      }
    }
    console.log(`Retrying GET request to ${url} in ${retryAfter} seconds`);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    retries += 1;
  }

  throw new Error('Max retries reached');
}

export async function POST(url: string, data: any, headers: any = {}) {
  return await axios.post(url, data, { headers });
}

module.exports = { GET, POST };
