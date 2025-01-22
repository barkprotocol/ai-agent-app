const importMap = {
    imports: {
      "rpc-websockets/dist/lib/client": "./node_modules/rpc-websockets/dist/lib/client.js",
      "rpc-websockets/dist/lib/client/websocket": "./node_modules/rpc-websockets/dist/lib/client/websocket.js",
    },
  }
  
  require("esbuild-plugin-import-map").register(importMap)
  
  