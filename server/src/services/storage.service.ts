import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';
import path from 'path';

const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();
const BUCKET_NAME = 'documents';

let supabase: ReturnType<typeof createClient> | null = null;
if (provider === 'supabase') {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set when STORAGE_PROVIDER=supabase');
  }
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const uploadFile = async (localPath: string, fileName: string, userId: string, mimeType: string): Promise<string> => {
  if (provider === 'local') {
    return localPath;
  }

  if (!supabase) throw new Error('Supabase client not initialized');

  const fileBuffer = fs.readFileSync(localPath);
  const storagePath = `${userId}/${path.basename(localPath)}`; 

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  return storagePath;
};

export const deleteFile = async (storagePath: string): Promise<void> => {
  if (provider === 'local') {
    if (fs.existsSync(storagePath)) {
      try {
        fs.unlinkSync(storagePath);
      } catch (err) {
        console.error(`Failed to delete local file ${storagePath}:`, err);
      }
    }
    return;
  }

  if (!supabase) throw new Error('Supabase client not initialized');

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    console.error(`Failed to delete from Supabase: ${error.message}`);
  }
};

export const downloadToTemp = async (storagePath: string): Promise<string> => {
  if (provider === 'local') {
    return storagePath;
  }

  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(storagePath);

  if (error || !data) {
    throw new Error(`Failed to download from Supabase: ${error?.message}`);
  }

  const tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}-${path.basename(storagePath)}`);
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  fs.writeFileSync(tempFilePath, buffer);
  
  return tempFilePath;
};
