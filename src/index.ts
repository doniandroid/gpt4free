addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Load Pyodide
  let pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
  });

  // Install g4f (jika diperlukan)
  await pyodide.loadPackage("micropip");
  await pyodide.runPythonAsync(`
    import micropip
    await micropip.install('g4f')
  `);

  // Jalankan skrip Python Anda
  const output = await pyodide.runPythonAsync(`
    from g4f.client import Client

    client = Client()
    response = client.images.generate(
        model="flux",
        prompt="a white siamese cat",
        response_format="url"
    )

    response.data[0].url
  `);

  // Kembalikan hasil sebagai respons
  return new Response(`Generated image URL: ${output}`, {
    headers: { "Content-Type": "text/plain" },
  });
}
