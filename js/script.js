"use strict";

document.addEventListener("DOMContentLoaded", () => {
    

    const initBurgerMenu = () => {
        const burgerBtn = document.querySelector(".header__burger");
        const navMenu = document.querySelector(".header__nav");
        const pageBody = document.body;

        if (!burgerBtn || !navMenu) return;

        const toggleMenu = () => {
            burgerBtn.classList.toggle("header__burger--active");
            navMenu.classList.toggle("header__nav--open");
            pageBody.classList.toggle("page--lock");
        };

        const closeMenu = () => {
            burgerBtn.classList.remove("header__burger--active");
            navMenu.classList.remove("header__nav--open");
            pageBody.classList.remove("page--lock");
        };

        burgerBtn.addEventListener("click", toggleMenu);


        const navLinks = document.querySelectorAll(".header__nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    };


    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll(".faq-item");

        faqItems.forEach(item => {
            const trigger = item.querySelector(".faq-item__trigger");
            const wrapper = item.querySelector(".faq-item__answer-wrapper");

            if (!trigger || !wrapper) return;

            trigger.addEventListener("click", () => {
                const isOpen = item.classList.contains("faq-item--open");

                
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("faq-item--open")) {
                        otherItem.classList.remove("faq-item--open");
                        otherItem.querySelector(".faq-item__answer-wrapper").style.maxHeight = "0px";
                    }
                });

                if (isOpen) {
                    item.classList.remove("faq-item--open");
                    wrapper.style.maxHeight = "0px";
                } else {
                    item.classList.add("faq-item--open");
                    
                    wrapper.style.maxHeight = `${wrapper.scrollHeight}px`;
                }
            });
        });

        
        window.addEventListener("resize", () => {
            faqItems.forEach(item => {
                if (item.classList.contains("faq-item--open")) {
                    const wrapper = item.querySelector(".faq-item__answer-wrapper");
                    wrapper.style.maxHeight = `${wrapper.scrollHeight}px`;
                }
            });
        });
    };


    initBurgerMenu();
    initFaqAccordion();
});