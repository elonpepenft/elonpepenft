let web3;
let account;
let curLang;
let contract;
let mintIndex;

window.addEventListener("load", async function () {
    translateLanguage();

    web3 = await new Web3(window.ethereum);
    contract = await new web3.eth.Contract(ABI, CONTRACTADDRESS);
    await check_status();
})

async function check_status() {
    mintIndex = await contract.methods.totalSupply().call();
    document.querySelector(".remaining").innerHTML = '<span>' + (10000 - Number(mintIndex)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>/ 10,000';
}

async function mint(){
    if (window.ethereum) {
        await window.ethereum.request({ method: "net_version" }).then((res) => {
            if(!(res == 1 || res == 5)){
                alert("메타마스크 네트워크를 확인해주세요. You should check MetaMask network.");
                return
            }
        });
    } else {
        alert("메타마스크를 설치하고 활성화해주세요. Please install and activate MetaMask.");
        return;
    }

    await check_status();

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });

    account = accounts[0];

    if (10000 <= Number(mintIndex)) {
        alert("모든 NFT가 민팅되었습니다. All NFTs are minted.");
        return;
    }

    let nftBalance = await contract.methods.balanceOf(account).call();

    if(Number(nftBalance) > 0){
        alert("당신은 이미 NFT를 보유하였습니다. You already have a NFT.");
        return;
    }

    try {
        const result = await contract.methods.publicMint(1).send({
            from: account,
            value: 0,
        });
    
        if (result != null) {
            alert("축하합니다! 성공적으로 여러분의 NFT가 민팅되었습니다. Congratulations! Your NFT has been minted successfully.");
            await check_status();
        }
    } catch (err) {
        console.log(err)
        alert("민팅에 실패하였습니다. 재시도 하시거나 팀에 문의해주세요. Mint failed. Please retry or contact the team.");
        await check_status();
    }
}

function translateLanguage(){

    let kors = document.querySelectorAll(".kor");
    let engs = document.querySelectorAll(".eng");

    if(curLang == "EN"){
        for(let i = 0; i < kors.length; i++){
            kors[i].style.display = "block"
        }

        for(let i = 0; i < engs.length; i++){
            engs[i].style.display = "none"
        }

        curLang = "KR"
    }else{
        for(let i = 0; i < kors.length; i++){
            kors[i].style.display = "none"
        }

        for(let i = 0; i < engs.length; i++){
            engs[i].style.display = "block"
        }

        curLang = "EN"
    }
}

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    grabCursor: true,
    autoplay: {
        delay: 1000,
        disableOnInteraction: false,
    },
    breakpoints: {
        577: {
            slidesPerView: 2,
            spaceBetween: 16,
        },
        769:{
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1025: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        1321: {
            slidesPerView: 5,
            spaceBetween: 20,
        },
    },
});