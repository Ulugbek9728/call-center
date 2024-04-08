import styled from "styled-components";
import FlagUz from "../../img/flag-uz.png";
import FlagEn from "../../img/flag-en.png";
import FlagRu from "../../img/flag-ru.png";

const LanguageSwitcherStyle = styled.div`
  position: relative;
  top: 8px;
  cursor: pointer;
  z-index: 100;

  .dropdown__item, .dropdown__menu__item {
    color: rgb(0, 0, 0,);
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    display: flex;
    align-items: center;

    &.hidden {
      display: none;
    }
  }

  .dropdown__menu {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 15px;
    top: 110%;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 40px rgba(27, 107, 80, 0.1);
    backdrop-filter: blur(30px);
    border-radius: 5px;
    visibility: hidden;
    opacity: 0;
    transition: 0.2s;
  }

  &.show {
    .dropdown__menu {
      visibility: visible;
      opacity: 0.9;
    }
  }

  .dropdown__item__lang__image {
    width: 30px;
    height: 30px;
    display: block;
    margin-right: 5px;
    background-size: cover;

    &.uz {
      background-image: url(${FlagUz});
    }

    &.en {
      background-image: url(${FlagEn});
    }

    &.ru {
      background-image: url(${FlagRu});
    }
  }

  .dropdown__item__lang__text {
    text-transform: uppercase;
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
  }

  .dropdown__menu__item {
    cursor: pointer;
    justify-content: center;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    padding: 10px 0;
    color: black;
  }

  @media screen and (max-width: 1512px) {

    .dropdown__item, .dropdown__menu__item {
      span {
        font-size: 14px;
        line-height: 17px;
      }
    }

    .dropdown__item__lang__image {
      width: 18px;
      height: 18px;
    }

    .dropdown__icon {
      width: 10px;
    }
  }
  @media screen and (max-width: 768px) {
    .dropdown__item__lang__image {
      width: 18px;
      height: 18px;
    }

    .dropdown__item__lang__text {
      font-size: 14px;
      line-height: 17px;
    }

  }
`;

export default LanguageSwitcherStyle;