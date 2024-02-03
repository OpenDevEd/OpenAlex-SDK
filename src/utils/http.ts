import axios from 'axios';

export async function GET(url: string, headers: any = {}) {
  return await axios.get(url, { headers });
}

export async function POST(url: string, data: any, headers: any = {}) {
  return await axios.post(url, data, { headers });
}

module.exports = { GET, POST };
