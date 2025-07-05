// backup.js

let gapiLoaded = false;
let isSignedIn = false;

const CLIENT_ID = '509237418993-5up562v9a48m4hk7eflo4scrimef6cmr.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

function loadGapi() {
  return new Promise((resolve) => {
    if (gapiLoaded) return resolve();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({ clientId: CLIENT_ID, scope: SCOPES });
      gapiLoaded = true;
      resolve();
    });
  });
}

export async function initGoogleDriveAuth() {
  await loadGapi();
  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
  isSignedIn = true;
}

// ---- Local Storage ----

export function saveToLocal(chatId, messages) {
  const key = `chat_${chatId}`;
  localStorage.setItem(key, JSON.stringify(messages));
}

export function loadFromLocal(chatId) {
  const key = `chat_${chatId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// ---- Google Drive Backup ----

export async function backupToDrive(chatId) {
  if (!isSignedIn) return;

  const filename = `chat_${chatId}.json`;
  const content = localStorage.getItem(`chat_${chatId}`);
  if (!content) return;

  const file = await findFileByName(filename);
  if (file) {
    await gapi.client.request({
      path: `/upload/drive/v3/files/${file.id}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: content,
    });
  } else {
    await gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'media' },
      body: content,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: filename,
        parents: ['appDataFolder'],
      }),
    });
  }
}

export async function restoreFromDrive(chatId) {
  if (!isSignedIn) return [];

  const filename = `chat_${chatId}.json`;
  const file = await findFileByName(filename);
  if (!file) return [];

  const res = await gapi.client.request({
    path: `/drive/v3/files/${file.id}`,
    method: 'GET',
    params: { alt: 'media' },
  });

  const messages = JSON.parse(res.body);
  saveToLocal(chatId, messages);
  return messages;
}

async function findFileByName(name) {
  const res = await gapi.client.drive.files.list({
    spaces: 'appDataFolder',
    fields: 'files(id, name)',
    q: `name='${name}'`,
  });

  return res.result.files[0];
}