import { UploadApiResponse, v2 } from "cloudinary";
import { Readable } from "stream";

export default function uploadBuffer(
  buffer: Buffer,
  name?: string
): Promise<UploadApiResponse | undefined> {
  return new Promise((res, rej) => {
    const wstream = v2.uploader.upload_stream(
      { public_id: name },
      (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      }
    );

    const rstream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    rstream.pipe(wstream);
  });
}
