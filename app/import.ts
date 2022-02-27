import stream from 'stream';
import jsonstream from 'JSONStream';
import fs from 'fs';
import mongoose from 'mongoose';

const BATCH_LIMIT = 50;

const createStream = (dir: string, path: string): stream.PassThrough =>
  fs
    .createReadStream(dir)
    .pipe(jsonstream.parse(path))
    .pipe(
      new stream.PassThrough({
        objectMode: true,
      })
    );

export const importer = async <T extends typeof mongoose.Model>(
  dirs: string[],
  Model: T,
  path: string
) => {
  let docs: T[] = [];

  for await (const dir of dirs) {
    for await (const transaction of createStream(dir, path)) {
      docs.push(transaction);
      if (docs.length === BATCH_LIMIT) {
        await Model.insertMany(docs);
        docs = [];
      }
    }

    docs.length && Model.insertMany(docs);
  }
};
