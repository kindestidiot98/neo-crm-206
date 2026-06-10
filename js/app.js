"use strict";

document.addEventListener('DOMContentLoaded', () => {
    
    const navLinks = document.querySelectorAll('[data-target]');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('nav__link--active'));
            sections.forEach(s => s.classList.remove('section--active'));

            link.classList.add('nav__link--active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('section--active');
        });
    });

   
    const themeSelect = document.getElementById('theme-select');
    const page = document.body;

    const savedTheme = localStorage.getItem('neo_crm_theme') || 'dark';
    themeSelect.value = savedTheme;
    if (savedTheme === 'light') {
        page.classList.add('page--light');
    } else {
        page.classList.remove('page--light');
    }

    themeSelect.addEventListener('change', (e) => {
        const currentTheme = e.target.value;
        if (currentTheme === 'light') {
            page.classList.add('page--light');
        } else {
            page.classList.remove('page--light');
        }
        localStorage.setItem('neo_crm_theme', currentTheme);
    });

    
    let ordersData = JSON.parse(localStorage.getItem('neo_crm_orders')) || [];
    let recordsData = JSON.parse(localStorage.getItem('neo_crm_records')) || [];

    const saveOrders = () => localStorage.setItem('neo_crm_orders', JSON.stringify(ordersData));
    const saveRecords = () => localStorage.setItem('neo_crm_records', JSON.stringify(recordsData));

    const getNextOrderId = () => ordersData.length ? Math.max(...ordersData.map(o => o.id)) + 1 : 1;
    const getNextRecordId = () => recordsData.length ? Math.max(...recordsData.map(r => r.id)) + 1 : 1;

    
    const modalOrder = document.getElementById('modal-order');
    const modalRecord = document.getElementById('modal-record');
    const btnCreateOrder = document.getElementById('btn-create-order');
    const btnCreateRecord = document.getElementById('btn-create-record');
    const closeBtns = document.querySelectorAll('.modal__close');

    const openModal = (modal) => {
        if (!modal) return;
        modal.showModal();
        modal.querySelector('form').reset();
        clearValidation(modal.querySelector('form'));
    };

    if (btnCreateOrder) btnCreateOrder.addEventListener('click', () => openModal(modalOrder));
    if (btnCreateRecord) btnCreateRecord.addEventListener('click', () => openModal(modalRecord));

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (modalOrder) modalOrder.close();
            if (modalRecord) modalRecord.close();
        });
    });

    
    const phoneInputs = document.querySelectorAll('.form__input--phone');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let val = e.target.value.replace(/\D/g, '');
            if (!val) {
                e.target.value = '';
                return;
            }
            if (val[0] === '7' || val[0] === '8') {
                val = val.substring(1);
            }
            let x = val.match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x) return;
            e.target.value = '+7(' + x[1] + 
                (x[2] ? ')' + x[2] : '') + 
                (x[3] ? '-' + x[3] : '') + 
                (x[4] ? '-' + x[4] : '');
        });
    });

    const amountInput = document.querySelector('input[name="amount"]');
    if (amountInput) {
        amountInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    
    const regexPatterns = {
        client: /^[А-Яа-яA-Za-z\s]{2,50}$/,
        phone: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
        amount: /^\d+$/
    };

    const validateField = (input) => {
        const name = input.name;
        const value = input.value.trim();
        let isValid = true;

        if (input.required && value === '') {
            isValid = false;
        } else if (regexPatterns[name] && !regexPatterns[name].test(value)) {
            isValid = false;
        }

        if (!isValid) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
        return isValid;
    };

    const clearValidation = (form) => {
        form.querySelectorAll('.form__input').forEach(input => input.classList.remove('is-invalid'));
    };

    const handleFormSubmit = (e, callback) => {
        e.preventDefault();
        const form = e.target;
        let isFormValid = true;

        form.querySelectorAll('.form__input').forEach(input => {
            if (!validateField(input)) isFormValid = false;
        });

        form.querySelectorAll('.form__input').forEach(input => {
            input.addEventListener('input', () => validateField(input), { once: true });
        });

        if (isFormValid) {
            const formData = new FormData(form);
            const dataObj = Object.fromEntries(formData.entries());
            callback(dataObj);
            form.closest('dialog').close();
        }
    };

    const formatDate = () => {
        const now = new Date();
        return now.toLocaleDateString('ru-RU');
    };

    
    const renderOrders = () => {
        const tbody = document.getElementById('orders-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        ordersData.forEach(order => {
            const tr = document.createElement('tr');
            tr.className = 'table__row';
            tr.innerHTML = `
                <td class="table__cell" data-label="ID">${order.id}</td>
                <td class="table__cell" data-label="Клиент" title="${order.client}">${order.client}</td>
                <td class="table__cell" data-label="Телефон">${order.phone}</td>
                <td class="table__cell" data-label="Автомобиль" title="${order.car}">${order.car}</td>
                <td class="table__cell" data-label="Статус">
                    <select class="select select--status" data-id="${order.id}">
                        <option value="в работе" ${order.status === 'в работе' ? 'selected' : ''}>В работе</option>
                        <option value="ожидание" ${order.status === 'ожидание' ? 'selected' : ''}>Ожидание</option>
                        <option value="завершён" ${order.status === 'завершён' ? 'selected' : ''}>Завершён</option>
                    </select>
                </td>
                <td class="table__cell" data-label="Сумма">${order.amount} ₸</td>
                <td class="table__cell" data-label="Дата">${order.date}</td>
                <td class="table__cell" data-label="Действия">
                    <button class="button button--danger btn-delete-order" data-id="${order.id}">Удалить</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    const renderRecords = () => {
        const tbody = document.getElementById('records-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        recordsData.forEach(record => {
            const tr = document.createElement('tr');
            tr.className = 'table__row';
            tr.innerHTML = `
                <td class="table__cell" data-label="ID">${record.id}</td>
                <td class="table__cell" data-label="Клиент" title="${record.client}">${record.client}</td>
                <td class="table__cell" data-label="Телефон">${record.phone}</td>
                <td class="table__cell" data-label="Услуга" title="${record.service}">${record.service}</td>
                <td class="table__cell" data-label="Автомобиль" title="${record.car}">${record.car}</td>
                <td class="table__cell" data-label="Дата">${record.date}</td>
                <td class="table__cell" data-label="Действия">
                    <button class="button button--danger btn-delete-record" data-id="${record.id}">Удалить</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

   
    const formOrder = document.getElementById('form-order');
    if (formOrder) {
        formOrder.addEventListener('submit', (e) => {
            handleFormSubmit(e, (data) => {
                ordersData.push({
                    id: getNextOrderId(),
                    client: data.client.trim(),
                    phone: data.phone,
                    car: data.car.trim(),
                    status: 'в работе',
                    amount: data.amount,
                    date: formatDate()
                });
                saveOrders();
                renderOrders();
            });
        });
    }

    const formRecord = document.getElementById('form-record');
    if (formRecord) {
        formRecord.addEventListener('submit', (e) => {
            handleFormSubmit(e, (data) => {
                recordsData.push({
                    id: getNextRecordId(),
                    client: data.client.trim(),
                    phone: data.phone,
                    service: data.service.trim(),
                    car: data.car.trim(),
                    date: formatDate()
                });
                saveRecords();
                renderRecords();
            });
        });
    }


    const ordersTbody = document.getElementById('orders-tbody');
    if (ordersTbody) {
        ordersTbody.addEventListener('change', (e) => {
            if (e.target.classList.contains('select--status')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                const orderIndex = ordersData.findIndex(o => o.id === id);
                if (orderIndex > -1) {
                    ordersData[orderIndex].status = e.target.value;
                    saveOrders();
                }
            }
        });

        ordersTbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-order')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                ordersData = ordersData.filter(o => o.id !== id);
                saveOrders();
                renderOrders();
            }
        });
    }

    const recordsTbody = document.getElementById('records-tbody');
    if (recordsTbody) {
        recordsTbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-record')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                recordsData = recordsData.filter(r => r.id !== id);
                saveRecords();
                renderRecords();
            }
        });
    }

    renderOrders();
    renderRecords();
});