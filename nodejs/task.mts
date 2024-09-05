import { $, within, argv, fs, path, os } from "zx";
$.verbose = true;

if (argv.deploy) {
  await $`npx tsc`;
  await $`pm2 start pm2.json`;
}
