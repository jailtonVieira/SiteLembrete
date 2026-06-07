# NoteUp

## Objetivo
O site tem como objetivo ajudar os usuários a organizarem tarefas, compromissos e lembretes importantes, enviando notificações para evitar esquecimentos.

---
## 🌐 Deploy
O site está hospedado e pode ser acessado pelo link abaixo:

> **[https://noteup-mu.vercel.app/](https://noteup-mu.vercel.app/)**

---

## Público-alvo
- Estudantes
- Trabalhadores
- Pessoas que precisam organizar rotinas

---

## Funcionalidades
- Cadastro de usuário
- Login e autenticação
- Criação, edição e exclusão de lembretes
- Organização por listas (Trabalho, Pessoal, Estudos, Saúde etc.)
- Notificações com antecipação configurável
- Repetição de lembretes (diário, semanal, mensal)
- Lixeira com opção de restaurar
- Busca de lembretes
- Tema claro e escuro

---

## Tecnologias utilizadas

### Frontend
- React
- Vite
- React Router DOM v6

### Ferramentas
- GitHub
- Figma
- Trello

---

## Como executar o projeto

### Clonar o repositório
```bash
git clone https://github.com/jailtonVieira/SiteLembrete
```

### Entrar na pasta
```bash
cd SiteLembrete
```

### Instalar as dependências
```bash
npm install
```

### Rodar
```bash
npm run dev
```

---

## Como usar o NoteUp

### 1. Criar uma conta
Ao abrir o site pela primeira vez, clique em **"Criar conta gratuita"** na tela de login.
Preencha seu nome, email e uma senha com no mínimo 6 caracteres.

### 2. Fazer login
Na tela inicial, insira seu email e senha cadastrados e clique em **"Entrar"**.
Você também pode pressionar **Enter** para confirmar.

---

### 3. Tela Inicial (Dashboard)
Após o login você verá 4 cards de resumo:
- **Hoje**: lembretes com data de hoje ainda pendentes
- **Programados**: lembretes com data futura
- **Concluídos**: lembretes já marcados como feitos
- **Todos**: total de lembretes criados

---

### 4. Criar um lembrete
Clique no botão **"+ Novo lembrete"** no topo ou no botão **+** na barra inferior (celular).
Preencha os campos:
- **Título** *(obrigatório)*
- **Notas**: descrição adicional (Opcional)
- **Data e Hora**
- **Prioridade**: Alta, Média ou Baixa
- **Lista**: categoria do lembrete (ex: Trabalho, Saúde)
- **Notificação**: quanto tempo antes deseja ser avisado
- **Repetição**: Nunca, Diário, Semanal ou Mensal
- **URL**: link relacionado ao lembrete *(opcional)*

Clique em **"Salvar lembrete"** para confirmar.

---

### 5. Concluir um lembrete
Clique no **círculo** à esquerda do lembrete para marcá-lo como concluído.
Clique novamente para desfazer.

---

### 6. Selecionar vários lembretes
Clique no botão **"..."** no canto superior direito da tela inicial.
Selecione **"Selecionar lembretes"** e escolha os que deseja.
Na barra inferior aparecerão dois botões:
- **Concluir**: marca todos os selecionados como feitos
- **Lixeira**: move todos os selecionados para a lixeira

---

### 7. Editar um lembrete
Clique em qualquer lembrete para abrir a tela de detalhes.
Clique em **"Editar"** para alterar os campos e depois em **"Salvar alterações"**.

---

### 8. Lixeira
Lembretes excluídos vão para a **Lixeira** (ícone na barra de navegação).
Lá você pode:
- **Restaurar**: devolve o lembrete para a lista
- **Excluir**: remove permanentemente
- **Esvaziar lixeira**: apaga todos de uma vez

---

### 9. Listas
Acesse **"Listas"** na navegação para gerenciar suas categorias.
Clique em **"+ Nova lista"** para criar uma com nome, ícone e cor personalizados.

---

### 10. Buscar lembretes
Acesse **"Buscar"** na navegação.
Digite no mínimo **2 caracteres** para iniciar a busca.
Use os filtros **Alta, Média ou Baixa** para filtrar por prioridade.

---

### 11. Perfil
Clique no seu avatar ou acesse **"Perfil"** na navegação.
Você pode:
- Alterar seu **nome**
- Trocar sua **senha**
- Adicionar ou trocar sua **foto de perfil**

---

### 12. Tema claro e escuro
Clique no botão **Light / Dark** na sidebar (desktop) ou no topo (celular) para alternar entre os temas.
A preferência é salva automaticamente.

---

## Metodologia
O projeto é desenvolvido utilizando a metodologia ágil Scrum, com foco em organização, divisão de tarefas e entregas contínuas.

### O Scrum foi escolhido por permitir:
- Melhor divisão de tarefas
- Acompanhamento de progresso
- Organização do time
- Facilidade para corrigir problemas rapidamente
- Desenvolvimento em etapas (Sprints)

---

## Papéis da equipe

| Nome | Função | Responsabilidade |
|------|--------|-----------------|
| Jailton dos Santos | Scrum Master | Organização e Backend |
| Luiz Augusto | Product Owner | Definição de requisitos e Frontend |
| Luís Felipe | Desenvolvedor | UI/UX Design |
| Darlan | Desenvolvedor | UI/UX Design |
| Pedro | Desenvolvedor | Frontend |

---

## Integrantes
- Jailton dos Santos Vieira Filho
- Luiz Augusto Correia Freire
- Luís Felipe Silva Oliveira
- Darlan Lima Pereira da Silva
- Pedro Henrique Nogueira de Araújo

---

## Conclusão
O projeto busca auxiliar usuários na organização de rotinas, utilizando lembretes e notificações para reduzir o esquecimento de compromissos.
