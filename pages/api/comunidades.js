import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response) {

  if (request.method === 'POST') {

    const TOKEN = 'e95c3bdad1b5e7276fa27b187d4b62'
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "972855",
      ...request.body,
    });
    response.json({
      dados: 'chama fifio',
      registroCriado: registroCriado
    })
    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, apenas no POST'
  })

}