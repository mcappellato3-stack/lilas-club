# Lilás Club — pacote completo

Arquivos do site:

- `index.html` — home, buscas, filtros e perfis
- `anunciar.html` — cadastro completo de modelos/anunciantes
- `perfil.html` — página completa do perfil
- `style.css` — visual lilás claro e responsivo
- `locations.js` — Estados e cidades
- `app.js` — busca, favoritos, cards e integração do cadastro
- `logo-lilas-club.png` — logo oficial luxuoso
- `IDENTIDADE-LILAS-CLUB.md` — cores, logo e regras visuais oficiais

Fluxo: home → cadastrar modelo → escolher plano → simular pagamento → publicar → perfil aparece na home → abrir página do perfil.

## Pagamento de teste

Os valores, Pix e cartão desta versão são apenas uma simulação interna. Nenhuma cobrança real é realizada. A integração financeira verdadeira será conectada somente depois da escolha do provedor e da configuração segura das chaves no servidor.

## Perfis de teste desta versão
Esta versão inclui 3 perfis totalmente fictícios (São Paulo, Rio de Janeiro e Belo Horizonte), com 3 imagens ilustrativas locais em cada perfil e valores demonstrativos de R$ 100 / R$ 120 / R$ 200. Eles existem apenas para teste e podem ser removidos do array `demoProfiles` em `app.js`.
