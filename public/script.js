document.getElementById('script-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const script = document.getElementById('script').value;

    const response = await fetch('/script', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ script })
    });

    const data =  await response.text();
    alert('Respuesta del servidor: ' + data);
});