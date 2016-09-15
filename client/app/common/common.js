import angular from 'angular';
import Header from './header/header';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';
import Footer from './footer/footer';


let commonModule = angular.module('app.common', [
  Header.name,
  Navbar.name,
  Hero.name,
  Footer.name,
]);

export default commonModule;
