import participantes from './users.js';

// Componente usuario que mostra na tela o usuriocadastrado;

let componenteUsuarios = (participantes) => {
    let dataInscricaoFormatada = dayjs(Date.now()).to(participantes.dataInscricao);
    let dataCheckInFormatada = dayjs(Date.now()).to(participantes.dataCheckIn);

    if (participantes.dataCheckIn === null) {
        dataCheckInFormatada = `
                                <button class='chek-in' data-email='${participantes.email}'>
                                    Confirmar Check-In. 
                                </button>

                            `
    }

    return (
        `
    <tr>
        <td>
            <span>${participantes.nome}</span><br>         
            <small>${participantes.email}</small>
        </td>
        <td>${dataInscricaoFormatada}</td>
        <td>${dataCheckInFormatada}</td>
    </tr>   
    `

    );



}


// Função mostra todos os participantes na tela;

let showParticipantes = (participantes) => {
    document.querySelector('tbody').innerHTML = ' ';

    participantes.map(function (participante) {
        document.querySelector('tbody').innerHTML += componenteUsuarios(participante);
    });

}

// Cancelar o evento de recarregar pagina pelo botao;

const btn = document.querySelector(".btn");

btn.addEventListener("click", (event) => {

    // Cancelar o evento de recarregar pagina;
    // https://developer.mozilla.org/pt-BR/docs/Web/API/Event/preventDefault 

    event.preventDefault();

    // Usando formDate para pegar dados do formulario; 
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData

    getDadosParticipante();
});


// Pega os dados do usuario do formulario;

let getDadosParticipante = () => {
    const form = document.querySelector(".formulario");
    const dadosDoFormulario = new FormData(form);

    validarDadosForm(dadosDoFormulario.get('name'), dadosDoFormulario.get('email'));
}

// Limpar input do formulario;

let limparCampo = () => {
    const nome = document.querySelector("#name");
    const email = document.querySelector("#email");

    nome.value = "";
    email.value = "";

    focoInput();
}

// Função alert na tela:
// 'sucesso' - para sucesso; 
// 'erro' - para Erro;   

let alertTela = (erro = "erro") => {
    const divName = document.querySelector(".name");
    const divEmail = document.querySelector(".email");

    // Uso do setAttribute em js;
    // https://stackoverflow.com/questions/50960526/add-attribute-value-right-below-border-of-html-element-with-javascript-css

    if (erro == "sucesso") {
        divName.setAttribute("style", "border:2px; border-style:solid; border-color:aquamarine;");
        divEmail.setAttribute("style", "border:2px; border-style:solid; border-color:aquamarine;");
    } else if (erro == "erro") {
        divName.setAttribute("style", "border:2px; border-style:solid; border-color:red;");
        divEmail.setAttribute("style", "border:2px; border-style:solid; border-color:red;");
    }

}

// função de foco no input;

let focoInput = (foco = 'nome') => {
    const nome = document.querySelector("#name");
    const email = document.querySelector("#email");
    if (foco == 'nome') {
        nome.focus();
    } else if (foco == 'email') {
        email.focus();
    }

}

// Mensagem na tele do usuario;

let mensgemTela = (msg) => {
    alert(msg);
}

// valida dados de entrada do usuario;

let validarDadosForm = (nome, email) => {
    if (nome == '' && email == '') {
        mensgemTela('Os campos não podem ser vazio!');
        alertTela("erro");
        focoInput();
        return;
    } else if (nome == '') {
        mensgemTela('Os campos nome não pode ser vazio!');
        alertTela("erro");
        focoInput();
        return;
    } else if (email == '') {
        mensgemTela('Os campos e-mail não pode ser vazio!');
        alertTela("erro");
        focoInput('email');
        return;
    } else if (!validateEmail(email)) {
        mensgemTela('Informe um e-mail valido!');
        alertTela("erro");
        focoInput('email');
        return;
    } else {
        adicionaParticipante(nome, email);

    }
}

// Validar email do usuario;
// https://horadecodar.com.br/como-validar-email-com-javascript/

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Adiciona o participante no array;

let adicionaParticipante = (nome, email) => {

    let novoParticipante = {
        nome: nome,
        email: email,
        dataInscricao: Date.now(),
        dataCheckIn: null
    };


    // validar se email ja cadastrado no sistema;

    let buscaEmailUsuario = participantes.find((participante) => {
        return participante.email === email ? true : false;

    });

    if (buscaEmailUsuario) {
        alert('E-mail ja cadastrado no sistema!')
        limparCampo();
    } else {
        participantes.unshift(novoParticipante);
        showParticipantes(participantes);
        alertTela('sucesso');
        mensgemTela('Usuario adicionado com sucesso!!')
        limparCampo();
        clickCheckInUser();
    }

}



// Suponha que todos os botões tenham a classe "meu-botao";

let clickCheckInUser = () => {


    const botoes = document.querySelectorAll('.chek-in');

    // Adicione um ouvinte de clique a cada botão;
    botoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // Lógica para manipular o clique do botão aqui;
            let emailChekIn = e.target.dataset.email;

            var checkInUserNow = participantes.find((participante) => {
                return participante.email == emailChekIn;
            });

            // Assuming you know the index of the user you want to remove
            const indexToRemove = participantes.findIndex((participante) => participante.email === emailChekIn);

            if (indexToRemove !== -1) {
                participantes.splice(indexToRemove, 1);
            }


            var user = {
                nome: checkInUserNow.nome,
                email: checkInUserNow.email,
                dataInscricao: checkInUserNow.dataInscricao,
                dataCheckIn: Date.now()
            }

            //console.log(user);

            participantes.unshift(user)

            showParticipantes(participantes);
            clickCheckInUser();
        });
    });

}


// https://github.com/rocketseat-education/nlw-unite-html-css-js/tree/main  

focoInput();
showParticipantes(participantes);
clickCheckInUser();