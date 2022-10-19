import "./css/index.css"
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const logo = document.querySelector(".cc-logo span:nth-child(2) img")

function setTypeCard(type) {
    const colors = {
        visa: ["#436D99","#C69347"],
        mastercard:["#DF6F29","#C3129C"],
        nubank:["#06315E","#55034D"],
        default:["black","gray"],
        bradesco:["#5A0101","#B50808"]
    }

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);
    logo.setAttribute("src", `cc-${type}.svg`);

}

globalThis.setTypeCard = setTypeCard;


//security code
const securityCode = document.getElementById("security-code");
const securityCodePattern = {
    mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);


const expirationDate = document.getElementById("expiration-date");
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
         },
        YY:{
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        }
    }
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.getElementById("card-number");
const cardNumberPattern = {
    mask: [
        {
            mask:"0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa"
        },
        {
            mask:"0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },
        {
            mask:"0000 0000 0000 0000",
            regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
            cardtype: "nubank"
        },
        {
            mask:"0000 0000 0000 0000",
            cardtype: "default"
        },
        {
            mask:"0000 0000 0000 0000",
            regex: /^(?:35\d{0,2})\d{0,12}/,
            cardtype: "bradesco"
        }
    ],
    dispatch: function(appendend, dynamicMasked){
        const number = (dynamicMasked.value + appendend).replace(/\D/g,"");
        const foundMask = dynamicMasked.compiledMasks.find(({regex})=> number.match(regex));

        return foundMask;
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

// DOM do cartão

const addButton = document.getElementById("add-button");
addButton.addEventListener("click",()=>{
    console.log("voce clicou")
})

const form = document.querySelector("form").addEventListener("submit",(event)=>{
      event.preventDefault();
})

const titularName = document.getElementById("card-holder")
titularName.addEventListener("input",()=>{
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = titularName.value.length === 0 ? "FULANO DA SILVA" : titularName.value
    
})

securityCodeMasked.on("accept", ()=>{
      updateSecurityCode(securityCodeMasked.value);
})


function updateSecurityCode(code){
      const ccSecurity = document.querySelector(".cc-security .value")

      ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept",()=>{
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setTypeCard(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
    const ccNumber = document.querySelector(".cc-number")

    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", ()=>{
      updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}