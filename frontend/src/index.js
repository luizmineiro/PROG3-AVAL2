function openTab(evt, contentName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(contentName).style.display = "block";
    evt.currentTarget.className += " active";
}

async function renderCandidates(payload) {
    let page = document.getElementsByClassName("container-card").length;
    console.log(page);
    if (payload) {
        document.getElementById("loading-candidates").innerHTML = "Carregando candidatos...";
        if (page === 0) document.getElementById("candidates").innerHTML = "";
        fetch(`/api/candidates?type_query=${payload.type_query}&page=${page}&name=${payload.name}&position=${payload.position}&municipality=${payload.municipality}&status=${payload.status}`).then((response) => response.json()).then((data) => {
            document.getElementById("loading-candidates").innerHTML = "";
            data.candidates.forEach((candidate) => {
                let parentListCard = document.getElementById("candidates");

                if (candidate.cand_status) var elected = "Eleito(a)";
                else var elected = "Não eleito(a)";

                parentListCard.innerHTML += `
            <div class="card">
             <div class="container-card">
                <h4><b>${candidate.cand_nome}</b></h4>${candidate.cargo_nome}
                <p>${elected} com ${Intl.NumberFormat('pt-br').format(candidate.cand_votos)} votos</p>
                </div>
            </div>`
            });
        })
        document.getElementById("more-button").innerHTML = `<input type="button" onclick="checkSpecificSearch() ? renderCandidates(inputValues()) : renderCandidates(renderCandidates({'type_query': 'status', 'status': electedCheckbox() ? 1:0 }))" value="Carregar mais">`;
    }

}

function radioValue() {
    return document.querySelector('input[name="type-query"]:checked').value;
}

function inputValues() {
    if (document.querySelector('input[name="type-query"]:checked') == null) {
        alert("Você TEM que marcar alguma opção de pesquisa")
        return NaN;
    } else {
        return {
            "type_query": document.querySelector('input[name="type-query"]:checked').value,
            "name": document.getElementById("candidate-name").value,
            "status": 0,
            "municipality": document.getElementById("municipalities").value,
            "position": document.getElementById("position-select").value,
        };
    }

}


function renderDataListMinucipality() {
    fetch("/api/municipalities/").then(response => response.json()).then((res) => {
        res.municipalities.forEach((municipality) => {
            document.getElementById("municipalities-data").innerHTML += '<option value="' + municipality.nome + '" selected></option>'
        })
    })
}

function electedCheckbox() {
    return document.getElementById("checkbox-elected").checked;
}

function clearListCandidates() {
    document.getElementById("more-button").innerHTML = "";
    document.getElementById("candidates").innerHTML = "";
}

function checkSpecificSearch() {
    return document.getElementsByClassName('active')[0].innerHTML === "Pesquisa Específica";
}

renderDataListMinucipality();