let userEmail = document.querySelector('#first_email');
let userEmail2 = document.querySelector('#second_email');

//Чекбоксы 
const firstCheckbox = document.querySelector('#terms-and-conditions');
const secondCheckbox = document.querySelector('#disqualified-person');
const thirdCheckbox = document.querySelector('#privacy_check');
//const allCheckboxes = document.querySelectorAll('.terms-checkbox');

let email = '';
let loginClick = false;

const dashboardButton = document.querySelector('#dashboard_button');

//Экраны
const Welcome = document.querySelector('#Welcome');
const TermsAndConditions = document.querySelector('#Terms_and_Conditions');
const AllowConnection = document.querySelector('#Allow_connection');
const SelectAccount = document.querySelector('#Select_account');
const SuccessfulScreen = document.querySelector('#Transaction_Successful');

const error = document.querySelector('#Error');




//Показать экран
function showScreen(screen) {
    document.querySelectorAll('.section-old').forEach((e) => {
        e.style.display = 'none';
    })
    screen.style.display = 'block';
}



//Переключение экранов при клике на кнопки
document.querySelector('#start_button').onclick = (e) => {
    nextStep(e.target);
    email = userEmail.value;
    localStorage.setItem('TempUserEmail', email);
};

document.querySelector('#agree_button').onclick = (e) => {
    nextStep(e.target);
    localStorage.setItem('TempAgreement', true);
};

document.querySelector('#start_modal_button').onclick = (e) => {
    email = userEmail2.value;
    $('[data-remodal-id=modal]').remodal().close();
    showScreen(TermsAndConditions)
};

document.querySelectorAll('.prev-step').forEach((button) => {
    button.onclick = function () {
        prevStep(button);
    };
})



//Проверка на согласие с Terms and Coditions
document.querySelectorAll('.checkbox-field input[type="checkbox"]').forEach(checkbox => {

    checkbox.addEventListener('change', () => {
        if (firstCheckbox.checked && secondCheckbox.checked && thirdCheckbox.checked) {
            document.querySelector('#agree_button').classList.remove("disable");
        } else {
            document.querySelector('#agree_button').classList.add("disable");
        }
    });
});



//Проверка при загрузке страницы
window.onload = (event) => {
    if (validateEmail(userEmail.value)) {
        document.querySelector('#start_button').classList.remove("disable");
    }

    if (localStorage.getItem('TempUserEmail')) {
        email = localStorage.getItem('TempUserEmail');
        userEmail.value = email;
        document.querySelector('#start_button').classList.remove("disable");
        //showScreen(AllowConnection);

        if (localStorage.getItem('TempAgreement') == "true") {
            document.querySelectorAll('.terms-checkbox').forEach(element => element.classList.add("w--redirected-checked"));
            document.querySelector('#agree_button').classList.remove("disable");
            $('#agree_label').removeClass('disable');

            firstCheckbox.checked = true;
            secondCheckbox.checked = true;
            thirdCheckbox.checked = true;
        }

    }
};



//Валидатор email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


//Проверка первого email

function pressEnter(event) {
    if (event.keyCode == 13) {
        showScreen(TermsAndConditions);
        $('[data-remodal-id=modal]').remodal().close();
    };
}

userEmail.oninput = (e) => {


    if (validateEmail(e.target.value)) {
        document.querySelector('#start_button').classList.remove("disable");
        e.target.addEventListener('keydown', pressEnter);

    } else {
        document.querySelector('#start_button').classList.add("disable");
        e.target.removeEventListener('keydown', pressEnter);

    }
}

// //Проверка второго email
// userEmail2.oninput = (e) => {
//     if (validateEmail(e.target.value)) {
//         document.querySelector('#start_modal_button').classList.remove("disable");
//         localStorage.setItem('TempUserEmail', e.target.value);
//         e.target.addEventListener('keydown', pressEnter);

//     } else {
//         document.querySelector('#start_modal_button').classList.add("disable");
//         e.target.removeEventListener('keydown', pressEnter);
//     }
// }

//Следующий экран при нажатии на кнопку 
function nextStep(nextButton) {
    nextButton.closest('.section-old').style.display = 'none';
    nextButton.closest('.section-old').nextSibling.style.display = 'block';
}

function prevStep(button) {
    button.closest('.section-old').style.display = 'none';
    button.closest('.section-old').previousSibling.style.display = 'block';
}


//API________________________________________________________________________________________________

//Selects
const select = document.querySelector('#accounts');
const selectLogin = document.querySelector('#accounts_login');


const signButton = document.querySelector('#sign_button');
const loginModalButton = document.querySelector('#sign_button_login');
const signature = document.querySelector('#ref_signature');
const loginButton = document.querySelector('#login_modal_button');
const loginButton2 = document.querySelector('#login_modal_button_2');


//Проверка есть ли аккаунты в селекте
function checkAccounts() {
    if (select.length > 0) {
        signButton.classList.remove("disable");
        loginModalButton.classList.remove("disable");


    } else {
        signButton.classList.add("disable");
        loginModalButton.classList.add("disable");
        $('[data-remodal-id=reload]').remodal().open();
        var opt1 = document.createElement("option");
        opt1.value = "0";
        opt1.text = "No Kusama account";
        select.add(opt1, null);
    }
}


//Кнопка перезагрузка аккаунтов
document.querySelector('#reload_button').addEventListener('click', async () => {
    await loginAndGetAccounts();
})
document.querySelector('#reload_in_popup').addEventListener('click', async () => {
    await loginAndGetAccounts();
})


//Кнопки connect 
document.querySelector('#connect_button').addEventListener('click', async () => {
    loginClick = false;
    await loginAndGetAccounts();
})
document.querySelector('#connect_button_2').addEventListener('click', async () => {
    loginClick = true;
    await loginAndGetAccounts();
})


// Кнопка Sign        
signButton.addEventListener('click', async () => {
    registerPipeline();
})


// Кнопка Login в ошибке 
loginButton.addEventListener('click', async () => {
    loginPipeline(select);
})
loginButton2.addEventListener('click', async () => {
    loginPipeline(selectLogin);
})

// Кнопка Login в попапе авторизации 
loginModalButton.addEventListener('click', async () => {
    loginPipeline(selectLogin);
})


//Заполнение дашборда
function fillRefInfo(link, mail, adress, refNum, refSum) {
    document.querySelectorAll('.ref_link').forEach(element => {
        element.textContent = link;
    });
    document.querySelectorAll('.ref_count').forEach(element => {
        element.textContent = refNum;
    });
    document.querySelectorAll('.ref_sum').forEach(element => {
        element.textContent = refSum;
    });
    document.querySelectorAll('.ref_email').forEach(element => {
        element.textContent = mail;
    });
    document.querySelectorAll('.ref_kusama').forEach(element => {
        element.textContent = adress;
    });


}


window.addEventListener('DOMContentLoaded', function () {
    const app = window.PontemApp.create({
        appName: 'Pontem Network',
        apiUrl: 'https://api.pontem.network/api'
    })

    const {
        Account
    } = app;

    async function checkCountry() { // (1)
        let response = await Account.checkAccess();
        if (!response) {
            window.location.replace("https://pontem.network/crowdloan-country");
        }
    }

    checkCountry();

    // Подписываемся на истечение сессии, чтобы редиректить пользователя на страницу авторизации
    Account.onExpiresSession(() => {
        // Время жизни токена истекло, нужно заново авторизоваться.
        console.log('Auth token has expired');
        window.PontemApp.Account.logout();
        window.location.reload();
    })


    // После успешной авторизации данные сохраняются в LocalStorage, поэтому при перезагрузке страницы сессия восстановится
    if (Account.isAuth) {
        // Уже авторизовались. Можно показывать профиль

        Account.profile().then((profile) => {
            console.log(profile);
            dashboardButton.setAttribute("data-remodal-target", "ref");
            fillRefInfo(
                profile.profile.share_link,
                profile.email,
                profile.address,
                profile.profile.share_signups_count,
                profile.profile.rewardsAmount,
            );
            $('[data-remodal-id=ref]').remodal().open();
        });
    } else {
        dashboardButton.setAttribute("data-remodal-target", "login1");
    }

})

//Получаем список аккаунтов
async function loginAndGetAccounts() {
    const app = window.PontemApp;
    const {
        Extension,
        Account
    } = app;

    await Extension.init()
        .then(async () => {
            const accounts = await Extension.getAccounts();
            select.options.length = 0;
            selectLogin.options.length = 0;
            accounts.forEach((element, index) => {
                var opt = document.createElement("option");
                opt.value = index;
                opt.innerHTML = element.meta.name + ' — ' + element.address;

                var opt2 = opt.cloneNode(true);
                selectLogin.appendChild(opt2);

                select.appendChild(opt);
            });
            if (loginClick) {
                $('[data-remodal-id=login2]').remodal().open();
            }
            else {
                showScreen(SelectAccount);
            }

            checkAccounts();
            localStorage.removeItem('TempUserEmail');

        })
        .catch(e => {
            // Нет доступа к polkadot extension или он не установлен
            console.error(e);
            $('[data-remodal-id=extention]').remodal().open();
        })
}

//Регистрируемся
async function registerPipeline() {
    const app = window.PontemApp;
    const {
        Extension,
        Account
    } = app;

    await Extension.init()
        .then(async () => {
            const accounts = await Extension.getAccounts();

            let currentAccount = accounts[select.value];
            try {
                const account = await Account.register({
                    address: currentAccount.address,
                    email,
                    referralCode: undefined
                })
                // Пользователь зарегистрировался и автоматически авторизовался, можно показывать Dashboard
                signature.textContent = account;
                const profile = await Account.profile();
                fillRefInfo(
                    profile.profile.share_link,
                    profile.email,
                    profile.address,
                    profile.profile.share_signups_count,
                    profile.profile.rewardsAmount,
                );

                showScreen(SuccessfulScreen);
            } catch (e) {

                if (e.code == 203) {
                    console.error(e);
                } else {
                    $('[data-remodal-id=error]').remodal().open();
                }

            }


        })
        .catch(e => {
            // Нет доступа к polkadot extension или он не установлен
            console.error(e);
            $('[data-remodal-id=extention]').remodal().open();

        })
}


async function loginPipeline(select) {
    const app = window.PontemApp;
    const {
        Extension,
        Account
    } = app;

    await Extension.init()
        .then(async () => {
            const accounts = await Extension.getAccounts();
            let currentAccount = accounts[select.value];

            try {
                const account = await Account.login(currentAccount.address)
                // Авторизовались. Можно показывать профиль

                const profile = await Account.profile();
                console.log(profile);
                fillRefInfo(
                    profile.profile.share_link,
                    profile.email,
                    profile.address,
                    profile.profile.share_signups_count,
                    profile.profile.rewardsAmount,
                );
                $('[data-remodal-id=ref]').remodal().open();

            } catch (e) {
                console.error(e);
                $('[data-remodal-id=loginError]').remodal().open();
            }

        })
        .catch(e => {
            // Нет доступа к polkadot extension или он не установлен
            console.error(e);
            $('[data-remodal-id=extention]').remodal().open();
        })
}
