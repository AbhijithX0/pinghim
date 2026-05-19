const localtunnel = require("localtunnel");

async function main() {
  const tunnel = await localtunnel({ port: 3000 });
  console.log(tunnel.url);

  const close = () => {
    try {
      tunnel.close();
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", close);
  process.on("SIGTERM", close);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
