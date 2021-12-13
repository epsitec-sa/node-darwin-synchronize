const mutexAddon = require("./build/Release/mutex");

const mutexNameMaxLength = 31;
const mutexLocked = 35;

function createMutex(name, fileMode) {
  if (name.length > mutexNameMaxLength) {
    throw `mutex name length cannot be greater than ${mutexNameMaxLength}`;
  }

  const handle = Buffer.alloc(mutexAddon.sizeof_MutexHandle);

  const res = mutexAddon.CreateMutex(name, fileMode, handle);

  if (res !== 0) {
    throw `could not create mutex for object ${name}: ${res}`;
  }

  return handle;
}

function openMutex(name) {
  if (name.length > mutexNameMaxLength) {
    throw `mutex name length cannot be greater than ${mutexNameMaxLength}`;
  }

  const handle = Buffer.alloc(mutexAddon.sizeof_MutexHandle);

  const res = mutexAddon.OpenMutex(name, handle);

  if (res !== 0) {
    throw `could not open mutex for object ${name}: ${res}`;
  }

  return handle;
}

function waitMutex(handle) {
  const res = mutexAddon.WaitMutex(handle);

  if (res === mutexLocked) {
    throw `mutex is locked`;
  } else if (res !== 0) {
    throw `could not wait for mutex: ${res}`;
  }
}

function releaseMutex(handle) {
  const res = mutexAddon.ReleaseMutex(handle);

  if (res !== 0) {
    throw `could not release mutex: ${res}`;
  }
}

function closeMutex(handle) {
  mutexAddon.CloseMutex(handle);
}

module.exports = {
  createMutex,
  openMutex,
  waitMutex,
  releaseMutex,
  closeMutex,

  mutexFileMode: {
    S_IRWXU: 0000700 /* [XSI] RWX mask for owner */,
    S_IRUSR: 0000400 /* [XSI] R for owner */,
    S_IWUSR: 0000200 /* [XSI] W for owner */,
    S_IXUSR: 0000100 /* [XSI] X for owner */,

    /* Read, write, execute/search by group */
    S_IRWXG: 0000070 /* [XSI] RWX mask for group */,
    S_IRGRP: 0000040 /* [XSI] R for group */,
    S_IWGRP: 0000020 /* [XSI] W for group */,
    S_IXGRP: 0000010 /* [XSI] X for group */,

    /* Read, write, execute/search by others */
    S_IRWXO: 0000007 /* [XSI] RWX mask for other */,
    S_IROTH: 0000004 /* [XSI] R for other */,
    S_IWOTH: 0000002 /* [XSI] W for other */,
    S_IXOTH: 0000001 /* [XSI] X for other */,

    S_ISUID: 0004000 /* [XSI] set user id on execution */,
    S_ISGID: 0002000 /* [XSI] set group id on execution */,
    S_ISVTX: 0001000 /* [XSI] directory restrcted delete */,
  },
};
