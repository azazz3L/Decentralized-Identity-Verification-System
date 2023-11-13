import FormData from "form-data";
import axios from "axios";

export default async function IPFSutils(string) {
  const JWT =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMDJkY2NiZC03YmM2LTRmMjctYjcxNi02ZjVjMWY0MDYwMzMiLCJlbWFpbCI6ImhpdGVzaC53b3JrMDgxMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzhjZTIxMjVjYWJiZjljNzcxY2MiLCJzY29wZWRLZXlTZWNyZXQiOiJhYWU0ZmRjY2E5MzU5NjM2ODU5YjgxY2UzYWVhNjhmNGMxZGIyZDViNTUxMGJkNGQ5YjgxNmRlNTlkOGEwNzliIiwiaWF0IjoxNjk2NjA0ODcxfQ.dBEZPgpLWQX8ca3WCsR31J8zH6rVTPQbw0YV0jwc6JY";
  try {
    const buffer = new Blob([string], { type: "text/plain" }); // Convert string to Blob
    const data = new FormData();
    data.append("file", buffer, {
      filepath: "string.txt",
    });

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          Authorization: JWT,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
