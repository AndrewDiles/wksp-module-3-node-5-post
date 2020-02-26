const orderItems = {
    undefined: { label: 'Pick an item', imgUrl: './assets/question.jpg' },
    bottle: { label: 'Bottle', imgUrl: './assets/bottle.png' },
    shirt: { label: 'T-shirt', imgUrl: './assets/tshirt.png' },
    socks: { label: 'Socks', imgUrl: './assets/socks.jpg' },
}
const errorMessages = {
    '450': 'Item out of stock. :(',
    '550': 'Exiting user. Not allowed to place another order at the moment.',
    '650': 'Outside of delivery zone. :(',
    '000': 'Oops! Looks like we\'re missing some information.'
}
const submitButton = document.getElementById('confirm-button');
const order = document.getElementById('order');
const errorMsg = document.getElementById('error');
const size = document.getElementById('size');
const givenName = document.getElementById('givenName');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const address = document.getElementById('address');
const city = document.getElementById('city');
const province = document.getElementById('province');
const postcode = document.getElementById('postcode');
const country = document.getElementById('country');

const updateForm = () => {
    const sel = document.getElementById('order').value;
    if (sel === 'shirt') {
        document.getElementById('sizing').style.display = 'flex';
    } else {
        document.getElementById('sizing').style.display = 'none';
    }
    document.getElementById('order-image').style.backgroundImage = `url(${orderItems[sel].imgUrl}`;
}

const handleToggleErrorMessage = (errorStatus) => {

}

const handleSubmit = (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    console.log(email);
    const data = {
        order: order.value,
        size: size.value,
        givenName: givenName.value,
        surname: surname.value,
        email: email.value,
        address: address.value,
        city: city.value,
        province: province.value,
        postcode: postcode.value,
        country: country.value
    };

    fetch('/order', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        const { status, error } = data;
        if (status === 'success') {
            window.location.href = '/order-confirmed';
        } else if (error) {
            submitButton.disabled = false;
            errorMsg.style.display = 'flex';
            errorMsg.innerText = errorMessages[error];
        }
    });
}