"use strict";

const WOOD_L = "#D8A878";
const WOOD_D = "#8B5A2B";
const ESQ_FILL = "#B28152";
const ESQ_STROKE = "#62472D";
const DEFAULT_LOGO="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FtYWRhXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDMzOC40NSAxMDcuOTUiPgo8Zz4KICAgIDxwYXRoIGZpbGw9IiNlZDZiMWQiIGQ9Ik01Ni40MiwxMDYuMjdjLS4zNywwLS43NCwwLTEuMTEtLjAycy0uNzQtLjAzLTEuMTEtLjA2LS43NC0uMDYtMS4xLS4wOS0uNzMtLjA4LTEuMS0uMTMtLjczLS4xLTEuMS0uMTctLjczLS4xMy0xLjEtLjItLjczLS4xNS0xLjEtLjI0LS43My0uMTgtMS4wOS0uMjhjLS4zNi0uMS0uNzItLjItMS4wNy0uMzFzLS42OS0uMjItMS4wMy0uMzQtLjY3LS4yNC0uOTktLjM3LS42NC0uMjctLjk1LS40MS0uNjEtLjI5LS45MS0uNDQtLjU4LS4zMS0uODYtLjQ3LS41NS0uMzMtLjgyLS41LS41My0uMzUtLjc4LS41M2wuNDgtLjk0LjQ4LS45NC40OC0uOTQuNDgtLjk0LjQ4LS45NC40OC0uOTQuNDgtLjk0LjQ4LS45NGMuMi4xNS40MS4yOS42Mi40M3MuNDMuMjcuNjQuNDEuNDQuMjYuNjcuMzguNDYuMjQuNjkuMzYuNDcuMjMuNzIuMzQuNDkuMjEuNzQuMzIuNTEuMi43Ny4yOS41Mi4xOC43OS4yN2MuMjcuMDkuNTQuMTcuODEuMjRzLjU0LjE1LjgxLjIxLjU0LjEyLjgxLjE4LjU0LjEuODEuMTUuNTQuMDguODEuMTEuNTQuMDYuODIuMDguNTQuMDQuODIuMDUuNTUuMDIuODIuMDJjLjMxLDAsLjYxLDAsLjktLjAycy41OC0uMDQuODUtLjA3LjU0LS4wNy44LS4xMS41MS0uMS43NS0uMTYuNDgtLjEzLjctLjIxLjQ0LS4xNi42NS0uMjUuNDEtLjE5LjYxLS4zLjM4LS4yMi41Ni0uMzRjLjE4LS4xMi4zNC0uMjUuNS0uMzhzLjMtLjI3LjQzLS40Mi4yNS0uMjkuMzctLjQ1LjIxLS4zMi4zLS40OC4xNy0uMzQuMjMtLjUyLjEyLS4zNi4xNy0uNTUuMDgtLjM5LjEtLjU5LjAzLS40MS4wMy0uNjIsMC0uNC0uMDMtLjU5LS4wNS0uMzgtLjA5LS41Ni0uMDktLjM2LS4xNS0uNTMtLjEzLS4zNC0uMjEtLjQ5LS4xNy0uMzEtLjI2LS40Ni0uMjEtLjI5LS4zMi0uNDMtLjI1LS4yNy0uMzgtLjQtLjI4LS4yNS0uNDQtLjM3Yy0uMTYtLjEyLS4zMy0uMjMtLjUxLS4zM3MtLjM3LS4yLS41OC0uMjgtLjQyLS4xNy0uNjUtLjI0LS40Ny0uMTQtLjcyLS4yLS41Mi0uMTEtLjgtLjE1LS41Ny0uMDgtLjg3LS4xMS0uNjEtLjA1LS45NC0uMDctLjY2LS4wMi0xLjAxLS4wMmgtNC40OXYtNi41bDEuNDgtMS42OCwxLjQ4LTEuNjgsMS40OC0xLjY4LDEuNDgtMS42OCwxLjQ4LTEuNjgsMS40OC0xLjY4LDEuNDgtMS42OCwxLjQ4LTEuNjguMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDRoLTIyLjI5di03LjloMjkuNzZ2Ni4zOGwtMS40NywxLjY4LTEuNDcsMS42OC0xLjQ3LDEuNjgtMS40NywxLjY4LTEuNDcsMS42OC0xLjQ3LDEuNjgtMS40NywxLjY4LTEuNDcsMS42OC0uNjItLjM2LS42Mi0uMzYtLjYyLS4zNi0uNjItLjM2LS42Mi0uMzYtLjYyLS4zNi0uNjItLjM2LS42Mi0uMzZoMi44NWMuNjUsMCwxLjI5LjAyLDEuOS4wNnMxLjIxLjA5LDEuNzguMTcsMS4xMy4xNywxLjY2LjI4LDEuMDUuMjQsMS41NC4zOS45Ny4zMSwxLjQyLjUuODkuMzksMS4zLjYxLjgxLjQ2LDEuMTguNzIuNzMuNTMsMS4wNi44M2MuMzMuMjkuNjUuNi45NC45MXMuNTYuNjQuODEuOTcuNDguNjguNjksMS4wNC40LjcyLjU2LDEuMS4zMS43Ni40NCwxLjE2LjIzLjgxLjMxLDEuMjMuMTUuODUuMTksMS4yOS4wNi44OS4wNiwxLjM1YzAsLjMsMCwuNTktLjAzLjg5cy0uMDUuNTktLjA5Ljg3LS4wOS41OC0uMTUuODYtLjEzLjU3LS4yMS44NS0uMTcuNTYtLjI2LjgzLS4yMS41NS0uMzIuODItLjI1LjU0LS4zOC44LS4yOC41My0uNDQuNzljLS4xNi4yNi0uMzIuNTItLjUuNzZzLS4zNy40OS0uNTYuNzMtLjQxLjQ3LS42My42OS0uNDUuNDQtLjY5LjY1LS40OS40Mi0uNzUuNjItLjUzLjM5LS44Mi41OC0uNTcuMzctLjg4LjU0LS42Mi4zNC0uOTQuNWMtLjMyLjE2LS42Ni4zMS0xLjAxLjQ2cy0uNy4yNy0xLjA3LjM5LS43NS4yMy0xLjE0LjMzLS44LjE5LTEuMjEuMjctLjg0LjE1LTEuMjguMjEtLjg5LjExLTEuMzUuMTUtLjkzLjA3LTEuNDIuMDktLjk4LjAzLTEuNDguMDNaIi8+CiAgICA8cGF0aCBmaWxsPSIjZjliMjE1IiBkPSJNNzcuOTIsMTA1LjU0di02LjM4bDIuMDUtMS45NCwyLjA1LTEuOTQsMi4wNS0xLjk0LDIuMDUtMS45NCwyLjA1LTEuOTQsMi4wNS0xLjk0LDIuMDUtMS45NCwyLjA1LTEuOTRjLjE2LS4xNS4zMi0uMjkuNDctLjQzcy4zLS4yOC40NC0uNDIuMjgtLjI4LjQxLS40MS4yNS0uMjcuMzctLjQuMjMtLjI2LjM0LS4zOS4yMS0uMjUuMzEtLjM4LjE5LS4yNS4yOC0uMzcuMTctLjI0LjI0LS4zNmMuMDgtLjEyLjE1LS4yMy4yMi0uMzVzLjE0LS4yMy4yLS4zNC4xMi0uMjIuMTgtLjMzLjExLS4yMi4xNi0uMzIuMS0uMjEuMTUtLjMyLjA5LS4yMS4xMy0uMzEuMDgtLjIuMTEtLjMuMDYtLjIuMDktLjI5Yy4wMy0uMS4wNS0uMTkuMDgtLjI5cy4wNS0uMTkuMDctLjI4LjA0LS4xOC4wNi0uMjcuMDMtLjE4LjA1LS4yNy4wMy0uMTguMDQtLjI2LjAyLS4xNy4wMy0uMjYuMDEtLjE3LjAyLS4yNSwwLS4xNiwwLS4yNWMwLS4yMSwwLS40Mi0uMDMtLjYycy0uMDUtLjM5LS4wOC0uNTgtLjA4LS4zNy0uMTQtLjU1LS4xMi0uMzQtLjE5LS41MS0uMTUtLjMyLS4yNC0uNDctLjE5LS4zLS4zLS40My0uMjMtLjI3LS4zNS0uNC0uMjYtLjI1LS40MS0uMzYtLjMtLjIyLS40Ni0uMzItLjMzLS4xOS0uNTEtLjI4LS4zNi0uMTYtLjU2LS4yMy0uNC0uMTQtLjYxLS4xOS0uNDMtLjExLS42Ni0uMTUtLjQ2LS4wOC0uNzEtLjExLS41LS4wNS0uNzYtLjA2LS41My0uMDItLjgxLS4wMmMtLjIyLDAtLjQ0LDAtLjY2LjAycy0uNDQuMDMtLjY1LjA1LS40My4wNS0uNjQuMDgtLjQyLjA3LS42Mi4xMS0uNDEuMDktLjYxLjE1LS40LjExLS42LjE4LS4zOS4xMy0uNTkuMjEtLjM5LjE2LS41OC4yNGMtLjE5LjA5LS4zOC4xOC0uNTYuMjhzLS4zNi4yLS41NC4zMS0uMzUuMjMtLjUxLjM1LS4zMy4yNS0uNDkuMzgtLjMyLjI3LS40Ny40Mi0uMy4zLS40NS40Ni0uMjkuMzItLjQzLjQ5LS4yNy4zNS0uNDEuNTNsLS45LS41OC0uOS0uNTgtLjktLjU4LS45LS41OC0uOS0uNTgtLjktLjU4LS45LS41OC0uOS0uNThjLjItLjMuNDEtLjYuNjQtLjg5cy40Ni0uNTcuNy0uODQuNS0uNTQuNzYtLjc5LjU0LS41LjgyLS43NC41OC0uNDcuODgtLjcuNjItLjQ0Ljk0LS42NS42Ni0uNDEsMS0uNi43LS4zOCwxLjA2LS41NmMuMzYtLjE4Ljc0LS4zNCwxLjExLS41cy43Ni0uMywxLjE2LS40My43OS0uMjUsMS4yLS4zNy44Mi0uMjEsMS4yNC0uMy44NS0uMTcsMS4yOC0uMjMuODgtLjEyLDEuMzItLjE3LjktLjA4LDEuMzYtLjEuOTMtLjAzLDEuNDEtLjAzYy4zOSwwLC43OCwwLDEuMTcuMDJzLjc2LjA0LDEuMTMuMDcuNzMuMDcsMS4wOS4xMi43MS4xLDEuMDUuMTcuNjguMTQsMS4wMi4yMi42Ni4xNy45OC4yNy42NC4yLjk0LjMxLjYxLjIzLjkxLjM2Yy4zLjEzLjU4LjI2Ljg2LjQxcy41NS4yOS44MS40NS41Mi4zMi43Ni40OC40OS4zNC43Mi41Mi40NS4zNy42Ny41Ni40Mi4zOS42Mi42LjM5LjQyLjU3LjY0LjM1LjQ1LjUyLjY4Yy4xNi4yMy4zMi40Ny40Ni43MnMuMjguNDkuNC43NS4yNC41Mi4zNC43OC4yLjU0LjI4LjgyLjE1LjU2LjIyLjg1LjExLjU5LjE1Ljg5LjA3LjYxLjA5LjkyLjAzLjYzLjAzLjk1YzAsLjE3LDAsLjM0LDAsLjUycy0uMDEuMzQtLjAyLjUxLS4wMi4zNC0uMDQuNTEtLjA0LjM0LS4wNi41MS0uMDUuMzQtLjA3LjUxLS4wNi4zNC0uMDkuNTEtLjA3LjM0LS4xLjUxLS4wOC4zNC0uMTIuNTFjLS4wNC4xNy0uMDkuMzQtLjE1LjUxcy0uMTEuMzQtLjE4LjUyLS4xMy4zNS0uMjEuNTMtLjE2LjM1LS4yNC41My0uMTguMzYtLjI3LjU0LS4yLjM2LS4zMS41NS0uMjIuMzctLjM0LjU1LS4yNC4zNy0uMzcuNTZjLS4xMy4xOS0uMjcuMzgtLjQxLjU3cy0uMy4zOS0uNDUuNTktLjMzLjQtLjUuNi0uMzUuNDEtLjU0LjYyLS4zOC40Mi0uNTkuNjQtLjQxLjQzLS42My42Ni0uNDQuNDUtLjY4LjY3LS40Ny40Ni0uNzIuNjlsLTEuNywxLjYtMS43LDEuNi0xLjcsMS42LTEuNywxLjYtMS43LDEuNi0xLjcsMS42LTEuNywxLjYtMS43LDEuNi0uMjQtLjQ1LS4yNC0uNDUtLjI0LS40NS0uMjQtLjQ1LS4yNC0uNDUtLjI0LS40NS0uMjQtLjQ1LS4yNC0uNDVoMjMuOTl2OC4wMmgtMzIuMTNaIi8+CiAgICA8cGF0aCBmaWxsPSIjMmQ1ZGE5IiBkPSJNMTIwLjY4LDEwNS41NHYtMzguODdsNC4yNSw0LjI1aC0xMi43NnYtNy45aDE4LjM0djQyLjUyaC05Ljg0WiIvPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0xNzEuNDgsNjMuMmgzLjU4Yy40NCwwLC42Ni4yNy42Ni44djQxLjMyYzAsLjUzLS4yMi44LS42Ni44aC0xLjkyYy0uNDksMC0uNzMtLjI3LS43My0uOHYtMzYuOThoLS4yN2wtMTEuNzQsMjcuN2MtLjI3LjQ5LS42LjczLS45OS43M2gtMi4xOWMtLjQ0LDAtLjc1LS4yNC0uOTMtLjczbC0xMS45My0yNy43N2gtLjI3djM3LjA1YzAsLjUzLS4yMi44LS42Ni44aC0xLjkyYy0uNDQsMC0uNjYtLjI3LS42Ni0uOHYtNDEuMzJjMC0uNTMuMjItLjguNjYtLjhoMy41OGMuMzEsMCwuNTEuMTMuNi40bDEyLjQ2LDI5LjMxaC4yN2wxMi40Ni0yOS4zMWMuMDktLjI3LjI5LS40LjYtLjRaIi8+CiAgICA8cGF0aCBmaWxsPSIjMWYzMzFjIiBkPSJNMTk4LjM1LDEwNi4xM2gtNi4xOGMtLjI3LDAtLjU0LS4wMS0uOC0uMDNzLS41MS0uMDUtLjc1LS4wOS0uNDgtLjA5LS43MS0uMTUtLjQ1LS4xMy0uNjctLjIxLS40Mi0uMTctLjYyLS4yNy0uMzktLjIxLS41OC0uMzMtLjM2LS4yNS0uNTQtLjM5LS4zNC0uMjktLjQ5LS40NWMtLjE2LS4xNi0uMy0uMzMtLjQ0LS41cy0uMjctLjM2LS4zOC0uNTUtLjIzLS4zOS0uMzItLjU5LS4xOS0uNDItLjI3LS42NC0uMTUtLjQ1LS4yMS0uNjgtLjExLS40OC0uMTUtLjcyLS4wNy0uNTEtLjA5LS43Ny0uMDMtLjUzLS4wMy0uODF2LTE4LjE3YzAtLjI4LDAtLjU1LjAzLS44MXMuMDUtLjUyLjA5LS43Ny4wOS0uNDkuMTUtLjcyLjEzLS40Ni4yMS0uNjguMTctLjQzLjI3LS42NC4yMS0uNC4zMi0uNTkuMjUtLjM3LjM4LS41NS4yOC0uMzQuNDQtLjVjLjE2LS4xNi4zMi0uMzEuNDktLjQ1cy4zNS0uMjcuNTQtLjM5LjM4LS4yMy41OC0uMzMuNDEtLjE5LjYyLS4yNy40NC0uMTUuNjctLjIxLjQ3LS4xMS43MS0uMTUuNDktLjA3Ljc1LS4wOS41Mi0uMDMuOC0uMDNoNi4xOGMuMjcsMCwuNTQuMDEuOC4wM3MuNTEuMDUuNzUuMDkuNDguMDkuNzEuMTUuNDUuMTMuNjcuMjEuNDIuMTcuNjIuMjcuMzkuMjEuNTguMzMuMzYuMjUuNTQuMzkuMzQuMjkuNDkuNDVjLjE2LjE2LjMuMzMuNDQuNXMuMjcuMzYuMzguNTUuMjMuMzkuMzIuNTkuMTkuNDIuMjcuNjQuMTUuNDUuMjEuNjguMTEuNDguMTUuNzIuMDcuNTEuMDkuNzcuMDMuNTMuMDMuODF2MTguMTdjMCwuMjgsMCwuNTUtLjAzLjgxcy0uMDUuNTItLjA5Ljc3LS4wOS40OS0uMTUuNzItLjEzLjQ2LS4yMS42OC0uMTcuNDMtLjI3LjY0LS4yMS40LS4zMi41OS0uMjUuMzctLjM4LjU1LS4yOC4zNC0uNDQuNWMtLjE2LjE2LS4zMi4zMS0uNDkuNDVzLS4zNS4yNy0uNTQuMzktLjM4LjIzLS41OC4zMy0uNDEuMTktLjYyLjI3LS40NC4xNS0uNjcuMjEtLjQ3LjExLS43MS4xNS0uNDkuMDctLjc1LjA5LS41Mi4wMy0uOC4wM1pNMTkyLjM3LDEwMy44NWg1LjczYy4xOSwwLC4zOCwwLC41Ni0uMDJzLjM2LS4wMy41My0uMDYuMzMtLjA2LjQ5LS4xLjMxLS4wOS40Ni0uMTQuMjktLjExLjQzLS4xOC4yNy0uMTQuMzktLjIyLjI0LS4xNy4zNi0uMjYuMjItLjE5LjMyLS4zYy4xLS4xMS4yLS4yMi4yOS0uMzRzLjE3LS4yNC4yNS0uMzguMTUtLjI3LjIxLS40MS4xMi0uMjkuMTctLjQ1LjEtLjMyLjEzLS40OC4wNy0uMzQuMS0uNTIuMDQtLjM2LjA2LS41NS4wMi0uMzkuMDItLjU5di0xNy45N2MwLS4yLDAtLjQtLjAyLS41OXMtLjAzLS4zOC0uMDYtLjU1LS4wNi0uMzUtLjEtLjUyLS4wOC0uMzMtLjEzLS40OC0uMTEtLjMtLjE3LS40NS0uMTMtLjI4LS4yMS0uNDEtLjE2LS4yNi0uMjUtLjM4LS4xOS0uMjMtLjI5LS4zNGMtLjEtLjExLS4yMS0uMjEtLjMyLS4zcy0uMjMtLjE4LS4zNi0uMjYtLjI2LS4xNS0uMzktLjIyLS4yOC0uMTMtLjQzLS4xOC0uMy0uMS0uNDYtLjE0LS4zMi0uMDctLjQ5LS4xLS4zNS0uMDUtLjUzLS4wNi0uMzctLjAyLS41Ni0uMDJoLTUuNzNjLS4xOSwwLS4zOCwwLS41Ni4wMnMtLjM2LjAzLS41My4wNi0uMzMuMDYtLjQ5LjEtLjMxLjA5LS40Ni4xNC0uMjkuMTItLjQyLjE5LS4yNi4xNC0uMzkuMjMtLjI0LjE3LS4zNS4yNy0uMjIuMi0uMzIuMzFjLS4xLjExLS4xOS4yMy0uMjguMzVzLS4xNy4yNS0uMjUuMzgtLjE0LjI3LS4yMS40MS0uMTIuMjktLjE3LjQ1LS4wOS4zMS0uMTMuNDgtLjA3LjM0LS4wOS41MS0uMDQuMzYtLjA2LjU0LS4wMi4zOC0uMDIuNTh2MTcuOTdjMCwuMiwwLC4zOS4wMi41OHMuMDMuMzcuMDYuNTQuMDYuMzUuMDkuNTEuMDguMzIuMTMuNDguMTEuMy4xNy40NS4xMy4yOC4yMS40MS4xNi4yNi4yNS4zOC4xOC4yNC4yOC4zNWMuMS4xMS4yMS4yMS4zMi4zMXMuMjMuMTkuMzUuMjcuMjUuMTYuMzkuMjMuMjguMTMuNDIuMTkuMy4xLjQ2LjE0LjMyLjA4LjQ5LjEuMzUuMDUuNTMuMDYuMzcuMDIuNTYuMDJaIi8+CiAgICA8cGF0aCBmaWxsPSIjMWYzMzFjIiBkPSJNMjEzLjQ0LDEwNS41MnYtMzEuMzNjMC0uMDUsMC0uMSwwLS4xNHMuMDEtLjA5LjAyLS4xMi4wMi0uMDcuMDQtLjEuMDMtLjA2LjA1LS4wOS4wNC0uMDUuMDctLjA3LjA2LS4wMy4wOS0uMDUuMDctLjAyLjEtLjAzLjA4LDAsLjEyLDBoMTIuNDJjLjI3LDAsLjU0LjAxLjguMDNzLjUxLjA1Ljc1LjA5LjQ4LjA5LjcxLjE1LjQ1LjEzLjY3LjIxLjQyLjE3LjYyLjI3LjM5LjIxLjU4LjMzLjM2LjI1LjU0LjM5LjM0LjI5LjQ5LjQ1Yy4xNi4xNi4zLjMzLjQ0LjVzLjI3LjM2LjM4LjU1LjIzLjM5LjMyLjU5LjE5LjQyLjI3LjY0LjE1LjQ1LjIxLjY4LjExLjQ4LjE1LjcyLjA3LjUxLjA5Ljc3LjAzLjUzLjAzLjgxdjE4LjE3YzAsLjI4LDAsLjU1LS4wMy44MXMtLjA1LjUyLS4wOS43Ny0uMDkuNDktLjE1LjcyLS4xMy40Ni0uMjEuNjgtLjE3LjQzLS4yNy42NC0uMjEuNC0uMzIuNTktLjI1LjM3LS4zOC41NS0uMjguMzQtLjQ0LjVjLS4xNi4xNi0uMzIuMzEtLjQ5LjQ1cy0uMzUuMjctLjU0LjM5LS4zOC4yMy0uNTguMzMtLjQxLjE5LS42Mi4yNy0uNDQuMTUtLjY3LjIxLS40Ny4xMS0uNzEuMTUtLjQ5LjA3LS43NS4wOS0uNTIuMDMtLjguMDNoLTEyLjQycy0uMDgsMC0uMTIsMC0uMDctLjAyLS4xLS4wMy0uMDYtLjAzLS4wOS0uMDUtLjA1LS4wNC0uMDctLjA3LS4wNC0uMDUtLjA1LS4wOS0uMDMtLjA3LS4wNC0uMS0uMDItLjA4LS4wMi0uMTIsMC0uMDksMC0uMTRaTTIxNi40NSwxMDMuODVoOS42NWMuMTksMCwuMzgsMCwuNTYtLjAycy4zNi0uMDMuNTMtLjA2LjMzLS4wNi40OS0uMS4zMS0uMDkuNDYtLjE0LjI5LS4xMS40My0uMTguMjctLjE0LjM5LS4yMi4yNC0uMTcuMzYtLjI2LjIyLS4xOS4zMi0uM2MuMS0uMTEuMi0uMjIuMjktLjM0cy4xNy0uMjQuMjUtLjM4LjE1LS4yNy4yMS0uNDEuMTItLjI5LjE3LS40NS4xLS4zMi4xMy0uNDguMDctLjM0LjEtLjUyLjA0LS4zNi4wNi0uNTUuMDItLjM5LjAyLS41OXYtMTcuOTdjMC0uMiwwLS40LS4wMi0uNTlzLS4wMy0uMzgtLjA2LS41NS0uMDYtLjM1LS4xLS41Mi0uMDgtLjMzLS4xMy0uNDgtLjExLS4zLS4xNy0uNDUtLjEzLS4yOC0uMjEtLjQxLS4xNi0uMjYtLjI1LS4zOC0uMTktLjIzLS4yOS0uMzRjLS4xLS4xMS0uMjEtLjIxLS4zMi0uM3MtLjIzLS4xOC0uMzYtLjI2LS4yNi0uMTUtLjM5LS4yMi0uMjgtLjEzLS40My0uMTgtLjMtLjEtLjQ2LS4xNC0uMzItLjA3LS40OS0uMS0uMzUtLjA1LS41My0uMDYtLjM3LS4wMi0uNTYtLjAyaC05LjY1cy0uMDgsMC0uMTIsMC0uMDcuMDEtLjEuMDItLjA2LjAyLS4wOS4wNC0uMDUuMDMtLjA3LjA1LS4wNC4wNC0uMDUuMDYtLjAzLjA1LS4wNC4wOC0uMDIuMDYtLjAyLjA5LDAsLjA3LDAsLjExdjI3LjA4czAsLjA3LDAsLjExLjAxLjA2LjAyLjA5LjAyLjA1LjA0LjA4LjAzLjA1LjA1LjA2LjA0LjA0LjA3LjA1LjA1LjAzLjA5LjA0LjA3LjAyLjEuMDIuMDgsMCwuMTIsMFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0yNTguOTMsNzMuNThoMS40MXMuMDksMCwuMTMsMCwuMDguMDEuMTEuMDMuMDcuMDMuMS4wNC4wNS4wNC4wOC4wNi4wNC4wNS4wNi4wOC4wMy4wNi4wNC4xLjAyLjA3LjAzLjExLDAsLjA4LDAsLjEzdjI0LjhjMCwuMjgsMCwuNTUtLjAzLjgxcy0uMDUuNTItLjA5Ljc3LS4wOS40OS0uMTUuNzItLjEzLjQ2LS4yMS42OC0uMTcuNDMtLjI3LjY0LS4yMS40LS4zMi41OS0uMjUuMzctLjM4LjU1LS4yOC4zNC0uNDQuNWMtLjE2LjE2LS4zMi4zMS0uNDkuNDVzLS4zNS4yNy0uNTQuMzktLjM4LjIzLS41OC4zMy0uNDEuMTktLjYyLjI3LS40NC4xNS0uNjcuMjEtLjQ3LjExLS43MS4xNS0uNDkuMDctLjc1LjA5LS41Mi4wMy0uOC4wM2gtNS42M2MtLjI3LDAtLjU0LS4wMS0uOC0uMDNzLS41MS0uMDUtLjc1LS4wOS0uNDgtLjA5LS43MS0uMTUtLjQ1LS4xMy0uNjctLjIxLS40Mi0uMTctLjYyLS4yNy0uMzktLjIxLS41OC0uMzMtLjM2LS4yNS0uNTQtLjM5LS4zNC0uMjktLjQ5LS40NWMtLjE2LS4xNi0uMy0uMzMtLjQ0LS41cy0uMjctLjM2LS4zOC0uNTUtLjIzLS4zOS0uMzItLjU5LS4xOS0uNDItLjI3LS42NC0uMTUtLjQ1LS4yMS0uNjgtLjExLS40OC0uMTUtLjcyLS4wNy0uNTEtLjA5LS43Ny0uMDMtLjUzLS4wMy0uODF2LTI0Ljc1YzAtLjA1LDAtLjEsMC0uMTRzLjAxLS4wOS4wMi0uMTIuMDItLjA3LjA0LS4xLjAzLS4wNi4wNi0uMDkuMDQtLjA1LjA3LS4wNy4wNi0uMDMuMDktLjA1LjA3LS4wMi4xLS4wMy4wOCwwLC4xMiwwaDEuNDZzLjA5LDAsLjEzLDAsLjA4LjAyLjExLjAzLjA3LjAzLjEuMDUuMDUuMDQuMDguMDcuMDQuMDUuMDYuMDkuMDMuMDcuMDQuMS4wMi4wOC4wMy4xMiwwLC4wOSwwLC4xNHYyNC42NWMwLC4yLDAsLjM5LjAyLjU4cy4wMy4zNy4wNi41NC4wNi4zNS4wOS41MS4wOC4zMi4xMy40OC4xMS4zLjE3LjQ1LjEzLjI4LjIxLjQxLjE2LjI2LjI0LjM4LjE4LjI0LjI4LjM1Yy4xLjExLjIxLjIxLjMyLjMxcy4yMy4xOS4zNS4yNy4yNS4xNi4zOS4yMy4yOC4xMy40Mi4xOS4zLjEuNDYuMTQuMzIuMDguNDkuMS4zNS4wNS41My4wNi4zNy4wMi41Ni4wMmg1LjE4Yy4xOSwwLC4zOCwwLC41Ni0uMDJzLjM2LS4wMy41My0uMDYuMzMtLjA2LjQ5LS4xLjMxLS4wOS40Ni0uMTQuMjktLjExLjQzLS4xOC4yNy0uMTQuMzktLjIyLjI0LS4xNy4zNi0uMjYuMjItLjE5LjMyLS4zYy4xLS4xMS4yLS4yMi4yOS0uMzRzLjE3LS4yNC4yNS0uMzguMTUtLjI3LjIxLS40MS4xMi0uMjkuMTctLjQ1LjEtLjMyLjEzLS40OC4wNy0uMzQuMS0uNTIuMDQtLjM2LjA2LS41NS4wMi0uMzkuMDItLjU5di0yNC42NWMwLS4wNSwwLS4xLDAtLjE0cy4wMS0uMDkuMDMtLjEyLjAzLS4wNy4wNC0uMS4wNC0uMDYuMDYtLjA5LjA1LS4wNS4wOC0uMDcuMDYtLjAzLjEtLjA1LjA3LS4wMi4xMS0uMDMuMDgsMCwuMTMsMFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0yODUuNjcsMTA2LjEzaC0xNS45OWMtLjM0LDAtLjUtLjItLjUtLjYxdi0zMS4zM2MwLS40LjE3LS42MS41LS42MWgxLjQ2Yy4zNywwLC41NS4yLjU1LjYxdjI5LjExYzAsLjMuMTcuNDYuNS40NmgxMy40N2MuNCwwLC42LjE5LjYuNTZ2MS4yN2MwLC4zNy0uMi41Ni0uNi41NloiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0yOTEsMTA2LjEzaC0xLjU2Yy0uMzcsMC0uNDktLjItLjM1LS42MWwxMC0zMS4zM2MuMS0uNC4zMy0uNjEuNy0uNjFoMi4zNmMuMzMsMCwuNTcuMi43LjYxbDEwLDMxLjMzYy4xLjQtLjAyLjYxLS4zNS42MWgtMS42MWMtLjM0LDAtLjU1LS4yLS42NS0uNjFsLTIuNzEtOC4xaC0xMy4xN2wtMi43MSw4LjFjLS4xMy40LS4zNS42MS0uNjUuNjFaTTMwMC44Niw3Ni4zNmwtNS43OCwxOC43OGgxMS44MWwtNS44My0xOC43OGgtLjJaIi8+CiAgICA8cGF0aCBmaWxsPSIjMWYzMzFjIiBkPSJNMzIwLjYxLDEwNi4xM2gtMS40NnMtLjA4LDAtLjEyLDAtLjA3LS4wMi0uMS0uMDMtLjA2LS4wMy0uMDktLjA1LS4wNS0uMDQtLjA3LS4wNy0uMDQtLjA1LS4wNS0uMDktLjAzLS4wNy0uMDQtLjEtLjAyLS4wOC0uMDItLjEyLDAtLjA5LDAtLjE0di0zMS4zM2MwLS4wNSwwLS4xLDAtLjE0cy4wMS0uMDkuMDItLjEyLjAyLS4wNy4wNC0uMS4wMy0uMDYuMDUtLjA5LjA0LS4wNS4wNy0uMDcuMDYtLjAzLjA5LS4wNS4wNy0uMDIuMS0uMDMuMDgsMCwuMTIsMGgxMS40NmMuMjcsMCwuNTQuMDEuOC4wM3MuNTEuMDUuNzUuMDkuNDguMDkuNzEuMTUuNDUuMTMuNjcuMjEuNDIuMTcuNjMuMjcuNC4yMS41OC4zMy4zNy4yNS41NC4zOS4zNC4yOS41LjQ1Yy4xNi4xNi4zMS4zMy40NS41cy4yNy4zNi4zOS41NS4yMy4zOS4zMy41OS4xOS40Mi4yNy42NC4xNS40NS4yMS42OC4xMS40OC4xNS43MmMuMDQuMjUuMDcuNTEuMDkuNzdzLjAzLjUzLjAzLjgxdjQuODFjMCwuMjQsMCwuNDctLjAyLjY5cy0uMDQuNDUtLjA3LjY2LS4wNy40Mi0uMTEuNjMtLjEuNC0uMTYuNi0uMTMuMzgtLjIuNTctLjE2LjM2LS4yNS41My0uMTkuMzQtLjI5LjUtLjIyLjMyLS4zNC40N2MtLjEyLjE1LS4yNC4zLS4zNy40M3MtLjI3LjI3LS40MS4zOS0uMjkuMjQtLjQ0LjM1LS4zMS4yMS0uNDcuMzEtLjMzLjE5LS41LjI3LS4zNS4xNi0uNTQuMjMtLjM3LjEzLS41Ny4xOS0uMzkuMS0uNi4xNXYuMmwuNzUsMS41OS43NSwxLjU5Ljc1LDEuNTkuNzUsMS41OS43NSwxLjU5Ljc1LDEuNTkuNzUsMS41OS43NSwxLjU5Yy4wMy4wNS4wNS4xLjA2LjE0cy4wMy4wOS4wMy4xMiwwLC4wNywwLC4xLS4wMS4wNi0uMDMuMDktLjAzLjA1LS4wNi4wNy0uMDUuMDMtLjA5LjA1LS4wNy4wMi0uMTIuMDMtLjA5LDAtLjE1LDBoLTEuNTZjLS4wNSwwLS4xMSwwLS4xNiwwcy0uMS0uMDItLjE0LS4wMy0uMDktLjAzLS4xMy0uMDUtLjA4LS4wNC0uMTItLjA3LS4wNy0uMDUtLjExLS4wOS0uMDYtLjA3LS4wOS0uMS0uMDYtLjA4LS4wOC0uMTItLjA1LS4wOS0uMDctLjE0bC0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OWgtNy45NHMtLjA4LDAtLjEyLDAtLjA3LjAxLS4xLjAyLS4wNi4wMi0uMDkuMDQtLjA1LjAzLS4wNy4wNS0uMDQuMDQtLjA1LjA2LS4wMy4wNS0uMDQuMDgtLjAyLjA2LS4wMi4wOSwwLC4wNywwLC4xMXYxMi4zYzAsLjA1LDAsLjEsMCwuMTRzLS4wMS4wOS0uMDMuMTItLjAzLjA3LS4wNC4xLS4wNC4wNi0uMDYuMDktLjA1LjA1LS4wOC4wNy0uMDYuMDMtLjEuMDUtLjA3LjAyLS4xMS4wMy0uMDgsMC0uMTMsMFpNMzIxLjY3LDkwLjU5aDguN2MuMTksMCwuMzgsMCwuNTYtLjAycy4zNi0uMDMuNTMtLjA2LjM0LS4wNi41LS4xLjMxLS4wOS40Ni0uMTQuMjktLjExLjQzLS4xOC4yNy0uMTQuNC0uMjIuMjUtLjE3LjM2LS4yNi4yMy0uMTkuMzMtLjNjLjEtLjExLjItLjIyLjI5LS4zNHMuMTgtLjI0LjI2LS4zNy4xNS0uMjcuMjItLjQxLjEyLS4yOS4xOC0uNDQuMS0uMzEuMTQtLjQ4LjA3LS4zMy4xLS41MS4wNS0uMzYuMDYtLjU0LjAyLS4zOC4wMi0uNTh2LTQuNzZjMC0uMiwwLS4zOS0uMDItLjU4cy0uMDMtLjM3LS4wNi0uNTQtLjA2LS4zNS0uMS0uNTEtLjA5LS4zMi0uMTQtLjQ4LS4xMS0uMy0uMTgtLjQ1LS4xNC0uMjgtLjIyLS40MS0uMTYtLjI2LS4yNi0uMzgtLjE5LS4yNC0uMjktLjM1Yy0uMS0uMTEtLjIxLS4yMS0uMzMtLjMxcy0uMjQtLjE5LS4zNi0uMjctLjI2LS4xNi0uNC0uMjMtLjI4LS4xMy0uNDMtLjE5LS4zLS4xLS40Ni0uMTQtLjMyLS4wOC0uNS0uMS0uMzUtLjA1LS41My0uMDYtLjM3LS4wMi0uNTYtLjAyaC04LjdzLS4wOCwwLS4xMiwwLS4wNy4wMS0uMS4wMi0uMDYuMDItLjA5LjA0LS4wNS4wMy0uMDcuMDUtLjA0LjA0LS4wNS4wNi0uMDMuMDUtLjA0LjA4LS4wMi4wNi0uMDIuMDksMCwuMDcsMCwuMTF2MTMuODJzMCwuMDcsMCwuMTEuMDEuMDYuMDIuMDkuMDIuMDUuMDQuMDguMDMuMDUuMDUuMDYuMDQuMDQuMDcuMDUuMDUuMDMuMDkuMDQuMDcuMDIuMS4wMi4wOCwwLC4xMiwwWiIvPgogIDwvZz4KICA8cG9seWdvbiBmaWxsPSIjMzk1ZjI5IiBwb2ludHM9IjcwLjc5IDAgNi41NSAxMDcuOTUgMTEuMDYgMTA3Ljk1IDc1LjMxIDAgNzAuNzkgMCIvPgogIDxwb2x5Z29uIGZpbGw9IiM2Mzg4NTIiIHBvaW50cz0iNjQuMjQgMCAwIDEwNy45NSAxLjUgMTA3Ljk1IDY1Ljc1IDAgNjQuMjQgMCIvPgogIDxnPgogICAgPHBhdGggZmlsbD0iIzFmMzMxYiIgZD0iTTM3LjkzLDczLjU1bC0yMC4xOSwzMy45M2MtLjA5LjE1LS4xNy4zMS0uMjQuNDhoOS4wOWwyMC40OC0zNC40MWgtOS4xNFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWIiIGQ9Ik01NS4zOCw1OS41OEw4Ni40Nyw3LjM0bDMzLjcsNTIuMThoOS4yN2MtLjA4LS4xOS0uMTctLjM2LS4yOC0uNTNMOTEuMDcsMGgtOS4zN2wtMzUuNDYsNTkuNThoOS4xNFoiLz4KICA8L2c+Cjwvc3ZnPg==";
const SNAP=0.10, GRID=1.0, TOL=0.25, WALL=0.10, POST=0.14; 

// ── Conexão com o Supabase (substitui o backend em Google Apps Script) ──
// Preencha SUPABASE_ANON_KEY com a chave "anon public" do seu projeto
// (Project Settings → API, no painel do Supabase). Essa chave é pública —
// tudo fica protegido pelas funções RPC (SECURITY DEFINER) no banco,
// que validam o token da 321 Modular antes de devolver qualquer dado.
const sb = window.SuperAppAuth.getClient();

// Chama uma função RPC (Postgres) no Supabase e devolve o corpo de resposta
// no mesmo formato { ok, ... } que o backend antigo (Apps Script) devolvia
// — assim o resto do app não precisou ser reescrito, só esta camada.
async function callRPC(fn, params) {
  const { data, error } = await sb.rpc(fn, params);
  if (error) throw new Error(error.message || "Erro de conexão com o Supabase.");
  return data;
}

// ── Estado de precificação — preenchido pela API após auth ────
// pricingData é null enquanto não autenticado.
// Estrutura após auth bem-sucedida:
// {
//   perfil: "Gestor" | "Vendedor",
//   franquia: string,
//   podeEditar: bool,
//   aliquotas: { margemGestor, margemVendedor },  // só para Gestor
//   produtos: [{ nome, precoFinal, precoBase? }]  // precoBase só para Gestor
// }
let pricingData = null;
let pricingMap  = {};
let insumosMap  = {}; // Ponto 5: { painelRef: [{painelRef, nome, precoFinal, precoBase?}, ...] }
let tokenAtivoSessao = ""; // token ativo na sessão atual (independente de localStorage ou URL)

// ── Constrói pricingMap e insumosMap (Ponto 5) a partir da resposta da API ──
function chaveCatalogo(valor){
  return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').replace(/\s*\/\s*/g,' / ').replace(/\s*-\s*/g,' - ')
    .trim().toUpperCase();
}
function aplicarPricingData(data) {
  pricingData = data || {};
  pricingMap  = {};
  (pricingData.produtos || []).forEach(p => {
    pricingMap[p.nome] = p;
    pricingMap[chaveCatalogo(p.nome)] = p;
  });
  insumosMap = {};
  (pricingData.insumos || []).forEach(ins => {
    const painel = chaveCatalogo(ins.painelRef || '');
    if (!insumosMap[painel]) insumosMap[painel] = [];
    insumosMap[painel].push(ins);
  });
}

// ── Re-fetches pricing data from the backend and refreshes open UI ──────────
// Chamada após salvar margem/preço (silenciosa, quem salvou já vê a
// confirmação própria) e também pelo polling periódico (não silenciosa —
// avisa discretamente se algo mudou, ex: o Gestor alterou margens enquanto
// um Vendedor estava com o app aberto).
async function recarregarPrecos(opts) {
  opts = opts || {};
  if (!tokenAtivoSessao) return;
  try {
    const antes = pricingData ? JSON.stringify(pricingData.produtos) : null;
    const data = await callRPC("autenticar", { p_token: tokenAtivoSessao });
    if (!data.ok) return;
    aplicarPricingData(data);
    // Atualiza modal do quantitativo se estiver aberto
    // Só reabre o Quantitativo se ele for de fato o modal aberto agora —
    // antes isso checava só "algum modal está aberto" (.scrim.show), o que
    // sequestrava qualquer outro modal (ex: Plantas Catálogo, tipos de
    // parede) e trocava por Quantitativo toda vez que os preços eram
    // atualizados em segundo plano (polling / voltar de outra aba).
    if (scrim.classList.contains('show') && modalBody.dataset.modal === 'quantitativo') abrirQuantitativo();
    // Avisa só quando os valores realmente mudaram (evita toast a cada poll)
    if (!opts.silent && antes !== null && antes !== JSON.stringify(data.produtos)) {
      toast("💰 Preços atualizados pelo Gestor.");
    }
  } catch (e) {
    console.warn("Falha ao recarregar preços:", e);
  }
}

// ── Polling periódico: mantém preços/margens sincronizados com o servidor
// enquanto o app fica aberto, sem precisar recarregar a página. Pausa
// quando a aba está em segundo plano (economiza chamadas) e força uma
// atualização imediata assim que a aba volta a ficar visível.
const PRICING_POLL_MS = 60000; // 60s
let pricingPollTimer = null;
function iniciarPollingPrecos() {
  if (pricingPollTimer) return; // já rodando
  pricingPollTimer = setInterval(() => {
    if (document.visibilityState === "visible") recarregarPrecos();
  }, PRICING_POLL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && tokenAtivoSessao) recarregarPrecos();
  });
}
// Estado do modal de quantitativo — persiste entre aberturas na mesma sessão
let qAjustes = {};             // { nomeProduto: deltaQty }
let qNovosItens = new Set();   // nomes de produtos adicionados manualmente que não estão no BOM
let qNovosInsumos = new Set(); // nomes de insumos adicionados manualmente que não estão no BOM
let qDesconto = { tipo: 'percent', valor: 0 }; // desconto aplicado ao orçamento
let qViewTab = 'paineis';      // 'paineis' | 'insumos' — sub-aba ativa no modal de Quantitativo
// Acréscimo manual de valor por item (R$), disponível para QUALQUER perfil
// (Admin, Gestor ou Vendedor) — soma-se ao preço de tabela do item.
// Só pode ser >= 0: dá pra cobrar a mais por um painel específico neste
// orçamento, nunca reduzir o preço de tabela. { nomeProduto: valorExtra }
let qPrecoAjustes = {};
let bomClipboard = null;       // clipboard para copiar/colar BOM entre painéis (piso)
let wtBomClipboard = null;    // clipboard para copiar/colar BOM entre paredes
let model3dClipboardByPrefix = {}; // clipboard p/ copiar/colar peças de Modelo 3D, uma por prefixo de formulário ('f' = piso/mezanino/escada, 'wt' = parede)
const uid=()=>Math.random().toString(36).slice(2,9);
const fmt=n=>Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const WLAB={none:"—",solid:"sólida",open:"aberturas",window:"janela"};
const WALLCYCLE=["none","solid","open","window"];
const WIN_W=0.45; // largura da janela centralizada (metros)
function windowBlocks(edge,r,wallThick){
  // Janela centralizada de 45cm: dois blocos sólidos + vidro no meio
  const WALL_=wallThick||WALL;const dark="#1C1F24", glass="#BFD9EE";
  const segs=[];
  if(edge==="W"||edge==="E"){
    const x=(edge==="W")?r.x:(r.x+r.w-WALL_);
    const mid=r.y+r.h/2, g0=mid-WIN_W/2, g1=mid+WIN_W/2;
    if(g0>r.y)segs.push({x,y:r.y,w:WALL_,h:g0-r.y,fill:dark});
    segs.push({x,y:g0,w:WALL_,h:WIN_W,fill:glass,isWindow:true});
    if(g1<r.y+r.h)segs.push({x,y:g1,w:WALL_,h:r.y+r.h-g1,fill:dark});
  } else {
    const y=(edge==="N")?r.y:(r.y+r.h-WALL_);
    const mid=r.x+r.w/2, g0=mid-WIN_W/2, g1=mid+WIN_W/2;
    if(g0>r.x)segs.push({x:r.x,y,w:g0-r.x,h:WALL,fill:dark});
    segs.push({x:g0,y,w:WIN_W,h:WALL,fill:glass,isWindow:true});
    if(g1<r.x+r.w)segs.push({x:g1,y,w:r.x+r.w-g1,h:WALL,fill:dark});
  }
  return segs;
}

// Modo de visualizacao do stage: '2d' ou '3d'. Preferencia de sessao apenas -
// NAO faz parte do projeto salvo (nao confundir com state.tabs/activeTab, que
// sao as abas de bloco/planta e nao tem nada a ver com este switch).
let state={
  "v": 5,
  "name": "",
  "meta": {
    "cliente": "",
    "local": "",
    "modelo": "",
    "revisao": "01",
    "projetadoPor": "321 MODULAR"
  },
  "tabs": [
    {
      "id": "geral",
      "name": "Geral"
    },
    {
      "id": "ok68q7e",
      "name": "A-Frame"
    },
    {
      "id": "3eyrz0l",
      "name": "Cabana"
    },
    {
      "id": "axiw2ch",
      "name": "Compacto"
    }
  ],
  "activeTab": "geral",
  "types": [
    {
      "id": "ky8g9ro",
      "name": "A-Frame - EC01 / Escada Santos Dumont Patamar",
      "w": 0.65,
      "d": 1.38,
      "defaultRot": 270,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "bomConfig": [
        {
          "produtoNome": "EC01 / ESCADA SANTOS DUMONT PATAMAR COM CORRIMAO",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "isStair": true,
      "patamar": true,
      "patamarComprimento": 0.7,
      "color": "#CFC8B8",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "crz8zxm",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20EC01.glb"
          }
        ]
      }
    },
    {
      "id": "43yj3pe",
      "name": "A-Frame - MZ01 / Mezanino 2,4M",
      "w": 1.85,
      "d": 2.4,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": {
        "th": 0.12,
        "esquadrias": [
          {
            "x": 0.15,
            "w": 1.56,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. OITÃO MAXIM-AR",
            "showName": true
          }
        ]
      },
      "lamina": null,
      "defaultRot": 180,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "MZ01 / MEZANINO 1 - 184,5 x 240,8",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "zw1soar",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/MZ01.glb"
          }
        ]
      }
    },
    {
      "id": "duyflhg",
      "name": "A-Frame - MZ04 / Mezanino 3,4M",
      "w": 1.85,
      "d": 3.4,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": {
        "th": 0.12,
        "esquadrias": [
          {
            "x": 0.15,
            "w": 1.56,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. OITÃO MAXIM-AR",
            "showName": true
          }
        ]
      },
      "lamina": null,
      "defaultRot": 180,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "MZ04 / MEZANINO 4 - 184,5 x 339,6",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "bxumzht",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/MZ04.glb"
          }
        ]
      }
    },
    {
      "id": "15b1okq",
      "name": "A-Frame - PS01 / Piso Deck",
      "w": 4.5,
      "d": 1.5,
      "color": "#8B5A2B",
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "hwall": null,
      "lamina": null,
      "defaultRot": 0,
      "mezanino": null,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": false,
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS01 / PISO DECK",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "kfn1v9j",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS01.glb"
          },
          {
            "id": "u7az6nr",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "mg26uvt",
            "role": "lateral_l_porta",
            "label": "Esq Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "bmmhuvy",
            "role": "lateral_r_solida",
            "label": "Dir Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Sld.glb"
          },
          {
            "id": "xseq097",
            "role": "lateral_r_porta",
            "label": "Dir Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "4tszjv9",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "nr94up2",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "eudflbn",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "p7bjn7x",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "otit0kx",
      "name": "A-Frame - PS02 / Piso Simples",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "hwall": null,
      "lamina": null,
      "defaultRot": 0,
      "mezanino": null,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": false,
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS02 / PISO SIMPLES",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "kfn1v9j",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS02.glb"
          },
          {
            "id": "u7az6nr",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "mg26uvt",
            "role": "lateral_l_porta",
            "label": "Esq Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "bmmhuvy",
            "role": "lateral_r_solida",
            "label": "Dir Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Sld.glb"
          },
          {
            "id": "xseq097",
            "role": "lateral_r_porta",
            "label": "Dir Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "4tszjv9",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "nr94up2",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "eudflbn",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "p7bjn7x",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "zfggn61",
      "name": "A-Frame - PS03 / Piso Banheiro (Janela)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "hwall": {
        "th": 0.12,
        "deck": 0.2,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.342,
            "w": 0.985,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 2 FOLHAS 100CMX100CM",
            "showName": true
          },
          {
            "x": 2.643,
            "w": 0.515,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 50X50CM",
            "showName": true
          }
        ]
      },
      "lamina": {
        "lx": 0.2999999999999998,
        "ly": -0.355,
        "lw": 1.8500000000000005,
        "lh": 0.7849999999999999
      },
      "defaultRot": 180,
      "mezanino": null,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC02 / PAREDE EXT. - JAN. BANHEIRO + JAN. COZINHA",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC02 / TELHADO LAMINA",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC05 / PAREDE EXT. - JAN. OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "EQ04 / JANELA OITAO MAXIM-AR EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS03 / PISO BANHEIRO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "lzxpsub",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS03%20Janela.glb"
          },
          {
            "id": "k7qytxp",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS03%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "rw08ccg",
      "name": "A-Frame - PS03 / Piso Banheiro (Porta)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.2,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.49,
            "w": 0.86,
            "type": "porta_giro",
            "opens": "dentro",
            "hinge": "direita",
            "name": "PORTA EXTERNA 80CM",
            "showName": true
          },
          {
            "x": 2.643,
            "w": 0.515,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 50X50CM",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": {
        "lx": 0.2999999999999998,
        "ly": -0.355,
        "lw": 1.8500000000000005,
        "lh": 0.7849999999999999
      },
      "defaultRot": 180,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC08 / PAREDE EXT. - JAN. BANHEIRO + PORTA",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC02 / TELHADO LAMINA",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC05 / PAREDE EXT. - JAN. OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "EQ04 / JANELA OITAO MAXIM-AR EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS03 / PISO BANHEIRO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "lzxpsub",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS03%20Porta.glb"
          },
          {
            "id": "k7qytxp",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS03%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "zz709le",
      "name": "A-Frame - PS04 / Piso Transição (Janela)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.35,
            "w": 1.8,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 3 FOLHAS 180CMX100CM",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC05 / PAREDE EXT. - JAN. OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "MR05 / MARCO JANELA OITAO FIXO EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS04 / PISO TRANSICAO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC22 / PAREDE EXT. - JAN. MAXIM-AR",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "wntlqz4",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS04%20Janela.glb"
          },
          {
            "id": "fclqjh1",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS04%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "5836fq4",
      "name": "A-Frame - PS04 / Piso Transição (Porta)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.35,
            "w": 1.8,
            "type": "porta_correr",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "PORTA JANELA 2 FOLHAS CORRER + 1 FIXA (180X210CM)",
            "showName": true
          }
        ]
      },
      "lamina": null,
      "defaultRot": 0,
      "mezanino": null,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC01 / PAREDE EXT. - PORTA JANELA",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PS04 / PISO TRANSICAO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "EQ01 / PORTA JANELA EUCALIPTO 11,9X179,6X218,5",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC05 / PAREDE EXT. - JAN. OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "MR05 / MARCO JANELA OITAO FIXO EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "wntlqz4",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS04%20Porta-Janela.glb"
          },
          {
            "id": "fclqjh1",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS04%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "tahwve9",
      "name": "A-Frame - PS04 / Piso Transição Sem Esquadria e Oitão",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 0.1,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 0.86,
            "w": 2.79,
            "type": "abertura",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PS04 / PISO TRANSICAO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC05 / PAREDE EXT. - JAN. OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "MR05 / MARCO JANELA OITAO FIXO EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "wntlqz4",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS04%20SN.glb"
          },
          {
            "id": "fclqjh1",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS04%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "co6hgo0",
      "name": "A-Frame - PS05 / Piso Rede",
      "w": 4.5,
      "d": 1.5,
      "color": "#8B5A2B",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": false,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": {
        "x0": 2.18,
        "x1": 4.18,
        "y0": 0.15,
        "y1": 1.35
      },
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS05 / PISO REDE",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "kfn1v9j",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS05.glb"
          },
          {
            "id": "u7az6nr",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "mg26uvt",
            "role": "lateral_l_porta",
            "label": "Esq Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "bmmhuvy",
            "role": "lateral_r_solida",
            "label": "Dir Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Sld.glb"
          },
          {
            "id": "xseq097",
            "role": "lateral_r_porta",
            "label": "Dir Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "4tszjv9",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "nr94up2",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "eudflbn",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "p7bjn7x",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "rupew3u",
      "name": "A-Frame - PS06 / Piso Banheiro Interno",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.11,
        "deck": 0.24,
        "x0": 2.55,
        "x1": 4.4,
        "twoTone": false,
        "esquadrias": []
      },
      "mezanino": null,
      "lamina": {
        "lx": 0.2999999999999998,
        "ly": -0.3999999999999999,
        "lw": 1.8500000000000005,
        "lh": 0.7999999999999999
      },
      "defaultRot": 180,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": false,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "wallThick": 0.1,
      "lateralEsq": {
        "enabled": true,
        "x0": 0.535,
        "x1": 0.965,
        "side": "dir"
      },
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC06 / TELHADO CLARABOIA + LAMINA",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS06 / PISO BANHEIRO INTERNO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC16 / PAREDE INT. - FECHADA - LAMINA",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "kfn1v9j",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20PS06.glb"
          },
          {
            "id": "mg26uvt",
            "role": "lateral_l_porta",
            "label": "Esq Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "bmmhuvy",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "xseq097",
            "role": "lateral_r_porta",
            "label": "Dir Abe",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "4tszjv9",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "nr94up2",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "eudflbn",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "p7bjn7x",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/A-Frame%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "escada_sd_cp",
      "name": "Cabana - EC01 / Escada Santos Dumont Patamar",
      "w": 0.65,
      "d": 1.38,
      "color": "#CFC8B8",
      "isStair": true,
      "patamar": true,
      "patamarComprimento": 1.25,
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 270,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "EC01 / ESCADA SANTOS DUMONT PATAMAR COM CORRIMAO",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "j9q6wbf",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20EC01.glb"
          }
        ]
      }
    },
    {
      "id": "jwleyhp",
      "name": "Cabana - MZ02 / Mezanino 2,4M",
      "w": 2.85,
      "d": 2.4,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": {
        "th": 0.12,
        "esquadrias": [
          {
            "x": 0.65,
            "w": 1.56,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. OITÃO MAXIM-AR + 2 JAN. FIXAS",
            "showName": true
          }
        ]
      },
      "lamina": null,
      "defaultRot": 180,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "MZ02 / MEZANINO 2 - 284,8 x 240,8",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "gv7z2l5",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/MZ02.glb"
          }
        ]
      }
    },
    {
      "id": "zrylejd",
      "name": "Cabana - MZ03 / Mezanino 3,4M",
      "w": 2.85,
      "d": 3.4,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": {
        "th": 0.12,
        "esquadrias": [
          {
            "x": 0.65,
            "w": 1.56,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. OITÃO MAXIM-AR + 2 JAN. FIXAS",
            "showName": true
          }
        ]
      },
      "lamina": null,
      "defaultRot": 180,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "MZ03 / MEZANINO 3 - 284,8 x 339,6",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "unjbvyi",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/MZ03.glb"
          }
        ]
      }
    },
    {
      "id": "cs4u7b3",
      "name": "Cabana - PS01 / Piso Deck",
      "w": 4.5,
      "d": 1.5,
      "color": "#8B5A2B",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": false,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS01 / PISO DECK",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "AC02 / SUPORTE TELHADO QUINA PAREDE LATERAL",
          "condicao": "piso_com_quina",
          "qty": 0.5
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "8y6x9be",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS01.glb"
          },
          {
            "id": "0dkegpr",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "o6tliwg",
            "role": "lateral_l_porta",
            "label": "Esq Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "xc8mdl6",
            "role": "lateral_r_solida",
            "label": "Dir Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Sld.glb"
          },
          {
            "id": "jyx4xgv",
            "role": "lateral_r_porta",
            "label": "Dir Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "8kpjxla",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "8a741fa",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "ngk9ozv",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "8eb2ffl",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "q207g9d",
      "name": "Cabana - PS02 / Piso Simples",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": false,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS02 / PISO SIMPLES",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "AC02 / SUPORTE TELHADO QUINA PAREDE LATERAL",
          "condicao": "piso_com_quina",
          "qty": 0.5
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "8y6x9be",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS02.glb"
          },
          {
            "id": "0dkegpr",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "o6tliwg",
            "role": "lateral_l_porta",
            "label": "Esq Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "xc8mdl6",
            "role": "lateral_r_solida",
            "label": "Dir Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Sld.glb"
          },
          {
            "id": "jyx4xgv",
            "role": "lateral_r_porta",
            "label": "Dir Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "8kpjxla",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "8a741fa",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "ngk9ozv",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "8eb2ffl",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "f8o5d4x",
      "name": "Cabana - PS03 / Piso Banheiro (Janela)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.2,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.012,
            "w": 0.985,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 2 FOLHAS 100CMX100CM",
            "showName": true
          },
          {
            "x": 2.952,
            "w": 0.515,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 50X50CM",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": {
        "lx": 0.2999999999999998,
        "ly": -0.355,
        "lw": 1.8500000000000005,
        "lh": 0.7849999999999999
      },
      "defaultRot": 180,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC11 / PAREDE EXT. - JAN. BANHEIRO + JAN. COZINHA - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC07 / TELHADO LAMINA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC13 / PAREDE EXT. - JAN. OITAO + JAN. FIXA",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "EQ04 / JANELA OITAO MAXIM-AR EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS03 / PISO BANHEIRO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC14 / PAREDE EXT. - FECHADA - LATERAL + LAMINA",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "8y6x9be",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS03%20Janela.glb"
          },
          {
            "id": "oequtxs",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS03%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "z7kshiq",
      "name": "Cabana - PS03 / Piso Banheiro (Porta)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.2,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.49,
            "w": 0.86,
            "type": "porta_giro",
            "opens": "dentro",
            "hinge": "direita",
            "name": "PORTA EXTERNA 80CM",
            "showName": true
          },
          {
            "x": 2.952,
            "w": 0.515,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 50X50CM",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": {
        "lx": 0.2999999999999998,
        "ly": -0.355,
        "lw": 1.8500000000000005,
        "lh": 0.7849999999999999
      },
      "defaultRot": 180,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC21 / PAREDE EXT. - JAN. BANHEIRO + PORTA EXT. - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC07 / TELHADO LAMINA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC13 / PAREDE EXT. - JAN. OITAO + JAN. FIXA",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "EQ04 / JANELA OITAO MAXIM-AR EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS03 / PISO BANHEIRO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC14 / PAREDE EXT. - FECHADA - LATERAL + LAMINA",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "9huke27",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS03%20Porta.glb"
          },
          {
            "id": "kiu6z82",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS03%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "cs3cdzi",
      "name": "Cabana - PS04 / Piso Transição (Janela)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.35,
            "w": 1.8,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "MAXIM-AR 3 FOLHAS 180CMX100CM",
            "showName": true
          },
          {
            "x": 0.288,
            "w": 0.86,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. FIXA",
            "showName": true
          },
          {
            "x": 3.352,
            "w": 0.86,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. FIXA",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC27 / PAREDE EXT. - JAN. MAXIM-AR - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC13 / PAREDE EXT. - JAN. OITAO + JAN. FIXA",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "MR05 / MARCO JANELA OITAO FIXO EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS04 / PISO TRANSICAO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "aphxp1a",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS04%20Janela.glb"
          },
          {
            "id": "9v2tjsl",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS04%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "kvtr1dj",
      "name": "Cabana - PS04 / Piso Transição (Porta)",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 1.35,
            "w": 1.8,
            "type": "porta_correr",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "PORTA JANELA 2 FOLHAS CORRER + 1 FIXA (180X210CM)",
            "showName": true
          },
          {
            "x": 0.288,
            "w": 0.86,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. FIXA",
            "showName": true
          },
          {
            "x": 3.352,
            "w": 0.86,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. FIXA",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC12 / PAREDE EXT. - PORTA JANELA + JAN. FIXA - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC13 / PAREDE EXT. - JAN. OITAO + JAN. FIXA",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "MR05 / MARCO JANELA OITAO FIXO EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS04 / PISO TRANSICAO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "EQ01 / PORTA JANELA EUCALIPTO 11,9X179,6X218,5",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "8y6x9be",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS04%20Porta-Janela.glb"
          },
          {
            "id": "tb39vfl",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS04%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "4bjd9y1",
      "name": "Cabana - PS04 / Piso Transição Sem Esquadria e Oitão",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 4.5,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 0.86,
            "w": 2.79,
            "type": "abertura",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC13 / PAREDE EXT. - JAN. OITAO + JAN. FIXA",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "MR05 / MARCO JANELA OITAO FIXO EUCALIPTO 11,9X100X153,5",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS04 / PISO TRANSICAO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC29 / PAREDE EXT. - FECHADA - TRAV.CAB. ESQ.",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC30 / PAREDE EXT. - FECHADA - TRAV.CAB. DIR.",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "tr3rmul",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS04%20SN.glb"
          },
          {
            "id": "m4fte28",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS04%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "lv6hvsd",
      "name": "Cabana - PS05 / Piso Rede",
      "w": 4.5,
      "d": 1.5,
      "color": "#8B5A2B",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": false,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": {
        "x0": 2.18,
        "x1": 4.18,
        "y0": 0.15,
        "y1": 1.35
      },
      "bomConfig": [
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS05 / PISO REDE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "AC02 / SUPORTE TELHADO QUINA PAREDE LATERAL",
          "condicao": "piso_com_quina",
          "qty": 0.5
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "8y6x9be",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS05.glb"
          },
          {
            "id": "0dkegpr",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "o6tliwg",
            "role": "lateral_l_porta",
            "label": "Esq Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "xc8mdl6",
            "role": "lateral_r_solida",
            "label": "Dir Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Sld.glb"
          },
          {
            "id": "jyx4xgv",
            "role": "lateral_r_porta",
            "label": "Dir Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "8kpjxla",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "8a741fa",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "ngk9ozv",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "8eb2ffl",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "32ultrs",
      "name": "Cabana - PS06 / Piso Banheiro Interno",
      "w": 4.5,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.11,
        "deck": 0.24,
        "x0": 2.55,
        "x1": 4.4,
        "twoTone": false,
        "esquadrias": []
      },
      "mezanino": null,
      "lamina": {
        "lx": 0.2999999999999998,
        "ly": -0.3999999999999999,
        "lw": 1.8500000000000005,
        "lh": 0.7999999999999999
      },
      "defaultRot": 180,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": false,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": {
        "enabled": true,
        "x0": 0.535,
        "x1": 0.965,
        "side": "dir"
      },
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC10 / TELHADO CLARABOIA + LAMINA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC01 / TELHADO SIMPLES",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC03 / TELHADO VIDRO",
          "condicao": "piso_parede_dir_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "TC04 / TELHADO QUINA 1",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "TC05 / TELHADO QUINA 2",
          "condicao": "piso_com_quina",
          "qty": 1
        },
        {
          "produtoNome": "PS06 / PISO BANHEIRO INTERNO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC26 / PAREDE INT. - FECHADA - LAMINA - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC37 / PAREDE EXT. - FECHADA - LATERAL + LAMINA BANH. INT",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_aberturas",
          "qty": 1
        },
        {
          "produtoNome": "AC02 / SUPORTE TELHADO QUINA PAREDE LATERAL",
          "condicao": "piso_com_quina",
          "qty": 0.5
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "8y6x9be",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20PS06.glb"
          },
          {
            "id": "o6tliwg",
            "role": "lateral_l_porta",
            "label": "Esq Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Abe.glb"
          },
          {
            "id": "xc8mdl6",
            "role": "lateral_l_solida",
            "label": "Esq Sld",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "jyx4xgv",
            "role": "lateral_r_porta",
            "label": "Dir Abr",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Lat%20Dir%20Abe.glb"
          },
          {
            "id": "8kpjxla",
            "role": "canto_tl",
            "label": "Sup Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Esq.glb"
          },
          {
            "id": "8a741fa",
            "role": "canto_tr",
            "label": "Sup Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Sup%20Dir.glb"
          },
          {
            "id": "ngk9ozv",
            "role": "canto_bl",
            "label": "Inf Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Esq.glb"
          },
          {
            "id": "8eb2ffl",
            "role": "canto_br",
            "label": "Inf Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Cabana%20-%20Quina%20Inf%20Dir.glb"
          }
        ]
      }
    },
    {
      "id": "hc72z9v",
      "name": "Compacto - MZ05 / Mezanino 1,2M",
      "w": 1.38,
      "d": 1.2,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": {
        "th": 0.12,
        "esquadrias": [
          {
            "x": 0.23,
            "w": 0.93,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JAN. OITÃO FIXA",
            "showName": true
          }
        ]
      },
      "lamina": null,
      "defaultRot": 180,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": null,
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false
    },
    {
      "id": "26kvdcd",
      "name": "Compacto - PS07 / Piso Transição",
      "w": 3,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.49,
        "x0": 0,
        "x1": 3,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 0.793,
            "w": 1.413,
            "type": "porta_correr",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "PORTA JANELA 3 FOLHAS CORRER",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC23 / PAREDE EXT. - PORTA JANELA - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC32 / PAREDE EXT. - JAN. OITAO - COMPACTO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS07 / PISO TRANSICAO - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "xpnm0in",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20PS07%20Porta-Janela.glb"
          },
          {
            "id": "55hfzpi",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20PS07%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "4o43dz0",
      "name": "Compacto - PS08 / Piso Simples",
      "w": 3,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PS08 / PISO SIMPLES - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "ebzp91u",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS08.glb"
          },
          {
            "id": "pvpdn0w",
            "role": "lateral_l_solida",
            "label": "Lat Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "dxirhsb",
            "role": "lateral_r_solida",
            "label": "Lat Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20Lat%20Dir%20Sld.glb"
          }
        ]
      }
    },
    {
      "id": "72ybh8e",
      "name": "Compacto - PS09 / Piso Banheiro",
      "w": 3,
      "d": 1.5,
      "color": "#D8A878",
      "hwall": {
        "th": 0.12,
        "deck": 0.2,
        "x0": 0,
        "x1": 3,
        "twoTone": true,
        "esquadrias": [
          {
            "x": 0.75,
            "w": 0.52,
            "type": "janela",
            "opens": "fora",
            "hinge": "esquerda",
            "name": "JANELA MAXIM-AR 2 FOLHAS",
            "showName": true
          }
        ]
      },
      "mezanino": null,
      "lamina": {
        "lx": -1.4,
        "ly": -0.6499999999999999,
        "lw": 1.26,
        "lh": 1.0799999999999998
      },
      "defaultRot": 180,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PC24 / PAREDE EXT. - JAN. BANHEIRO - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC32 / PAREDE EXT. - JAN. OITAO - COMPACTO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "PS09 / PISO BANHEIRO - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "AC03 / ABERTURA CHALE",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO EXT. ABERTO",
      "oitaoDefaultAtivo": true,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "3f5kpsv",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20PS09.glb"
          },
          {
            "id": "9cd6j33",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20PS09%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "jq1z2w5",
      "name": "Compacto - PS10 / Piso Deck Aberto",
      "w": 3,
      "d": 1.5,
      "color": "#8B5A2B",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "PS10 / PISO DECK - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "ebzp91u",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS10.glb"
          },
          {
            "id": "pvpdn0w",
            "role": "lateral_l_solida",
            "label": "Lat Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "dxirhsb",
            "role": "lateral_r_solida",
            "label": "Lat Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20Lat%20Dir%20Sld.glb"
          }
        ]
      }
    },
    {
      "id": "u3folbc",
      "name": "Compacto - PS10 / Piso Deck Coberto",
      "w": 3,
      "d": 1.5,
      "color": "#8B5A2B",
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 0,
      "defaultWalls": {
        "l": "solid",
        "r": "solid"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "TC08 / TELHADO SIMPLES - COMPACTO",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        },
        {
          "produtoNome": "PS10 / PISO DECK - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_esq_solida",
          "qty": 1
        },
        {
          "produtoNome": "PC09 / PAREDE EXT. - FECHADA - LATERAL",
          "condicao": "piso_parede_dir_solida",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "incompativelComPisoIds": [],
      "model3d": {
        "parts": [
          {
            "id": "ebzp91u",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PS10.glb"
          },
          {
            "id": "pvpdn0w",
            "role": "lateral_l_solida",
            "label": "Lat Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20Lat%20Esq%20Sld.glb"
          },
          {
            "id": "dxirhsb",
            "role": "lateral_r_solida",
            "label": "Lat Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/Compacto%20-%20Lat%20Dir%20Sld.glb"
          }
        ]
      }
    },
    {
      "id": "escada_sd_sp",
      "name": "EC04 / Escada Santos Dumont Simples",
      "w": 0.65,
      "d": 1.38,
      "color": "#CFC8B8",
      "isStair": true,
      "patamar": false,
      "patamarComprimento": 0,
      "hwall": null,
      "mezanino": null,
      "lamina": null,
      "defaultRot": 180,
      "defaultWalls": {
        "l": "none",
        "r": "none"
      },
      "lockWalls": true,
      "tabIds": [
        "geral",
        "ok68q7e",
        "3eyrz0l"
      ],
      "wallThick": 0.1,
      "lateralEsq": null,
      "rede": null,
      "bomConfig": [
        {
          "produtoNome": "EC04 / ESCADA SANTOS DUMONT SIMPLES COM CORRIMÃO",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "v02ganj",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/EC04.glb"
          }
        ]
      }
    }
  ],
  "panels": [],
  "labels": [],
  "wallTypes": [
    {
      "id": "qkolub3",
      "name": "PC19 / Parede Banheiro 3,29M",
      "length": 3.29,
      "thickness": 0.11,
      "defaultRot": 0,
      "tabIds": [
        "geral",
        "ok68q7e",
        "3eyrz0l"
      ],
      "door": null,
      "doors": [],
      "doorFlexible": false,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC19 / PAREDE INT. - FECHADA - HIDRÁULICA",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "m8naj1d",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC19.glb"
          }
        ]
      }
    },
    {
      "id": "ocht4d8",
      "name": "A-Frame - PC03 / Parede Banheiro Quadro Energia",
      "length": 1.85,
      "thickness": 0.11,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "door": null,
      "doors": [],
      "doorFlexible": false,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC03 / PAREDE INT. - FECHADA - QUADRO ENERGIA",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "hjnkpld",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC03.glb"
          }
        ]
      }
    },
    {
      "id": "hnc8zs0",
      "name": "Cabana - PC10 / Parede Banheiro Quadro Energia",
      "length": 1.85,
      "thickness": 0.11,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "door": null,
      "doors": [],
      "doorFlexible": false,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC10 / PAREDE INT. - FECHADA - QUADRO ENERGIA - LATERAL",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "7xom72p",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC10.glb"
          }
        ]
      }
    },
    {
      "id": "zm4986e",
      "name": "PC17 / Parede Banheiro Interno",
      "length": 2.4,
      "thickness": 0.11,
      "defaultRot": 0,
      "tabIds": [
        "geral",
        "ok68q7e",
        "3eyrz0l"
      ],
      "door": {
        "at": 0.17,
        "w": 0.57,
        "tipo": "porta_giro",
        "opens": "dentro",
        "hinge": "esquerda",
        "name": "PORTA BANHEIRO 60CM",
        "showName": true
      },
      "doors": [
        {
          "at": 0.17,
          "w": 0.57,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "esquerda",
          "name": "PORTA BANHEIRO 60CM",
          "showName": true
        }
      ],
      "doorFlexible": false,
      "allowedPisoIds": [
        "zfggn61",
        "rw08ccg",
        "f8o5d4x",
        "z7kshiq"
      ],
      "bomConfig": [
        {
          "produtoNome": "PC17 / PAREDE INT. - PORTA - HIDRAULICA - 2",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "f86d0zp",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC17.glb"
          }
        ]
      }
    },
    {
      "id": "3v8oxko",
      "name": "Compacto - PC34 / Parede Banheiro",
      "length": 2.8,
      "thickness": 0.12,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "axiw2ch"
      ],
      "door": {
        "at": 0.76,
        "w": 0.62,
        "tipo": "abertura",
        "opens": "fora",
        "hinge": "esquerda",
        "name": "PORTA BANHEIRO 62CM",
        "showName": true
      },
      "doors": [
        {
          "at": 0.76,
          "w": 0.62,
          "tipo": "abertura",
          "opens": "fora",
          "hinge": "esquerda",
          "name": "PORTA BANHEIRO 62CM",
          "showName": true
        }
      ],
      "doorFlexible": false,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC34 / PAREDE INT. - PORTA BANHEIRO - COMPACTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC35 / PAREDE INT. - FECHADA - OITAO - COMPACTO",
          "condicao": "oitao_ativo",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO INT. FECHADO",
      "oitaoDefaultAtivo": true,
      "model3d": {
        "parts": [
          {
            "id": "6nzt6ya",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC34.glb"
          },
          {
            "id": "igjwl6r",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC34%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "iigvcjp",
      "name": "Cabana - PC18 / Parede Interna 2 Portas",
      "length": 4.3,
      "thickness": 0.11,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "door": {
        "at": 1.13,
        "w": 0.66,
        "tipo": "porta_giro",
        "opens": "dentro",
        "hinge": "direita",
        "name": "PORTA BANHEIRO 60CM",
        "showName": true
      },
      "doors": [
        {
          "at": 1.13,
          "w": 0.66,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "direita",
          "name": "PORTA BANHEIRO 60CM",
          "showName": true
        },
        {
          "at": 2.06,
          "w": 0.66,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "esquerda",
          "name": "PORTA INTERNA 60CM",
          "showName": true
        }
      ],
      "doorFlexible": false,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC18 / PAREDE INT. - PORTA WC + PORTA QUARTO - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC28 / PAREDE INT. - FECHADA - OITAO - LATERAL",
          "condicao": "oitao_ativo",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO INT. FECHADO",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "u560otc",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC18-PC25%20-%20Oit.glb"
          },
          {
            "id": "s8589bz",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC18.glb"
          }
        ]
      }
    },
    {
      "id": "njooy6y",
      "name": "A-Frame - PC20 / Parede Interna 2 Portas",
      "length": 4.3,
      "thickness": 0.11,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "door": {
        "at": 1.16,
        "w": 0.66,
        "tipo": "porta_giro",
        "opens": "dentro",
        "hinge": "direita",
        "name": "PORTA BANHEIRO 60CM",
        "showName": true
      },
      "doors": [
        {
          "at": 1.16,
          "w": 0.66,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "direita",
          "name": "PORTA BANHEIRO 60CM",
          "showName": true
        },
        {
          "at": 2.09,
          "w": 0.66,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "esquerda",
          "name": "PORTA INTERNA 60CM",
          "showName": true
        }
      ],
      "doorFlexible": false,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC20 / PAREDE INT. - PORTA WC + PORTA QUARTO",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC15 / PAREDE INT. - FECHADA - OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO INT. FECHADO",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "evek5bq",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC20.glb"
          },
          {
            "id": "fzs1zc5",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC06-PC20%20-%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "25mke9w",
      "name": "A-Frame - PC06 / Parede Interna 1 Porta",
      "length": 4.3,
      "thickness": 0.11,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "ok68q7e"
      ],
      "door": {
        "at": 1.24,
        "w": 0.76,
        "tipo": "porta_giro",
        "opens": "dentro",
        "hinge": "esquerda",
        "name": "PORTA INTERNA 70CM",
        "showName": true
      },
      "doors": [
        {
          "at": 1.24,
          "w": 0.76,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "esquerda",
          "name": "PORTA INTERNA 70CM",
          "showName": true
        }
      ],
      "doorFlexible": true,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC06 / PAREDE INT. - PORTA - DIVISORIA",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC15 / PAREDE INT. - FECHADA - OITAO",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "EQ12 / PORTA ESQUERDA INTERNA SEMI-OCA 70CM 11X74,2X213",
          "condicao": "esq_esquadria_esq",
          "qty": 1
        },
        {
          "produtoNome": "EQ11 / PORTA DIREITA INTERNA SEMI-OCA 70CM 11X74,2X213",
          "condicao": "esq_esquadria_dir",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO INT. FECHADO",
      "oitaoDefaultAtivo": true,
      "model3d": {
        "parts": [
          {
            "id": "uchmojh",
            "role": "porta_dentro_esquerda",
            "label": "Dtr Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC06%20-%20Dentro%20Esq.glb"
          },
          {
            "id": "yua2gg2",
            "role": "porta_dentro_direita",
            "label": "Dtr Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC06%20-%20Dentro%20Dir.glb"
          },
          {
            "id": "kda2627",
            "role": "porta_fora_esquerda",
            "label": "For Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC06%20-%20Fora%20Esq.glb"
          },
          {
            "id": "i0d2q44",
            "role": "porta_fora_direita",
            "label": "For Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC06%20-%20Fora%20Dir.glb"
          },
          {
            "id": "ftsrsgs",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC06-PC20%20-%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "wf0d3os",
      "name": "Cabana - PC25 / Parede Interna 1 Porta",
      "length": 4.3,
      "thickness": 0.11,
      "defaultRot": 90,
      "tabIds": [
        "geral",
        "3eyrz0l"
      ],
      "door": {
        "at": 0.75,
        "w": 0.76,
        "tipo": "porta_giro",
        "opens": "dentro",
        "hinge": "esquerda",
        "name": "PORTA INTERNA 70CM",
        "showName": true
      },
      "doors": [
        {
          "at": 0.75,
          "w": 0.76,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "esquerda",
          "name": "PORTA INTERNA 70CM",
          "showName": true
        }
      ],
      "doorFlexible": true,
      "allowedPisoIds": [],
      "bomConfig": [
        {
          "produtoNome": "PC25 / PAREDE INT. - PORTA - DIVISORIA - LATERAL",
          "condicao": "padrao",
          "qty": 1
        },
        {
          "produtoNome": "PC28 / PAREDE INT. - FECHADA - OITAO - LATERAL",
          "condicao": "oitao_ativo",
          "qty": 1
        },
        {
          "produtoNome": "EQ12 / PORTA ESQUERDA INTERNA SEMI-OCA 70CM 11X74,2X213",
          "condicao": "esq_esquadria_esq",
          "qty": 1
        },
        {
          "produtoNome": "EQ11 / PORTA DIREITA INTERNA SEMI-OCA 70CM 11X74,2X213",
          "condicao": "esq_esquadria_dir",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": true,
      "nomeOitao": "OITÃO INT. FECHADO",
      "oitaoDefaultAtivo": true,
      "model3d": {
        "parts": [
          {
            "id": "agn8su1",
            "role": "porta_dentro_esquerda",
            "label": "Dtr Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC25%20-%20Dentro%20Esq.glb"
          },
          {
            "id": "7cc1get",
            "role": "porta_dentro_direita",
            "label": "Dtr Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC25%20-%20Dentro%20Dir.glb"
          },
          {
            "id": "qlxgljz",
            "role": "porta_fora_esquerda",
            "label": "For Esq",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC25%20-%20Fora%20Esq.glb"
          },
          {
            "id": "bjo9yk3",
            "role": "porta_fora_direita",
            "label": "For Dir",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC25%20-%20Fora%20Dir.glb"
          },
          {
            "id": "akxzgss",
            "role": "oitao",
            "label": "Oit",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC18-PC25%20-%20Oit.glb"
          }
        ]
      }
    },
    {
      "id": "5ad1b6o",
      "name": "PC04 / Parede Banheiro",
      "length": 2.4,
      "thickness": 0.11,
      "defaultRot": 0,
      "tabIds": [
        "geral",
        "ok68q7e",
        "3eyrz0l"
      ],
      "door": {
        "at": 0.17,
        "w": 0.57,
        "tipo": "porta_giro",
        "opens": "dentro",
        "hinge": "esquerda",
        "name": "PORTA BANHEIRO 60CM",
        "showName": true
      },
      "doors": [
        {
          "at": 0.17,
          "w": 0.57,
          "tipo": "porta_giro",
          "opens": "dentro",
          "hinge": "esquerda",
          "name": "PORTA BANHEIRO 60CM",
          "showName": true
        }
      ],
      "doorFlexible": false,
      "allowedPisoIds": [
        "rupew3u",
        "32ultrs"
      ],
      "bomConfig": [
        {
          "produtoNome": "PC04 / PAREDE INT. - PORTA - HIDRAULICA",
          "condicao": "padrao",
          "qty": 1
        }
      ],
      "possuiPossibilidadeOitao": false,
      "nomeOitao": "",
      "oitaoDefaultAtivo": false,
      "model3d": {
        "parts": [
          {
            "id": "owh5wus",
            "role": "base",
            "label": "Base",
            "url": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/PC04.glb"
          }
        ]
      }
    }
  ],
  "wallInstances": [],
  "manualDims": [],
  "render3d": {
    "hdrUrl": "https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/4k%20Textures/HDRISOCEU.hdr",
    "matPresets": {
      "Madeiras De Pinus": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 0.9,
        "metal": 0.5
      },
      "Telha": {
        "hue": 0,
        "sat": 1,
        "light": 0.14,
        "rough": 0.14,
        "metal": 1
      },
      "Vidro Esquadrias": {
        "hue": 0,
        "sat": 1,
        "light": -0.06,
        "rough": 0,
        "metal": 1
      },
      "Tronco das árvores": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 1,
        "metal": 1
      },
      "Folhagem das árvores": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 1,
        "metal": 1
      },
      "Grama (chão)": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 1,
        "metal": 1
      },
      "Base Piso": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 0.86,
        "metal": 1
      },
      "Assoalho Pinus": {
        "hue": 0,
        "sat": 1.62,
        "light": -0.08,
        "rough": 0.76,
        "metal": 1
      },
      "Blocos de fundação": {
        "hue": 0,
        "sat": 0.32,
        "light": -0.04,
        "rough": 0.58,
        "metal": 1
      }
    },
    "matPresetsLeve": {
      "Madeiras De Pinus": {
        "hue": 0,
        "sat": 1,
        "light": -0.22,
        "rough": 0.9,
        "metal": 0.5
      },
      "Telha": {
        "hue": 0,
        "sat": 1,
        "light": 0.14,
        "rough": 0.14,
        "metal": 1
      },
      "Vidro Esquadrias": {
        "hue": 0,
        "sat": 1,
        "light": -0.06,
        "rough": 0,
        "metal": 1
      },
      "Tronco das árvores": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 1,
        "metal": 1
      },
      "Folhagem das árvores": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 1,
        "metal": 1
      },
      "Grama (chão)": {
        "hue": 0,
        "sat": 1,
        "light": 0,
        "rough": 1,
        "metal": 1
      },
      "Base Piso": {
        "hue": 0,
        "sat": 1,
        "light": -0.22,
        "rough": 0.86,
        "metal": 1
      },
      "Assoalho Pinus": {
        "hue": 0,
        "sat": 1.62,
        "light": -0.22,
        "rough": 0.76,
        "metal": 1
      },
      "Blocos de fundação": {
        "hue": 0,
        "sat": 0.32,
        "light": -0.12,
        "rough": 0.58,
        "metal": 1
      }
    }
  }
}
// state.viewMode: preferencia de sessao (nao salva no projeto). Ver comentario acima.
state.viewMode='2d';
// state.floorMode: 'andar1' (padrao) ou 'andar2' — tambem preferencia de
// sessao, nao e salva no projeto. So faz sentido com viewMode==='2d'.
state.floorMode='andar1';

let view={scale:46,tx:0,ty:0};
let tool="select", armedType=null, armedWallType=null, selId=null;
let selIds=new Set(); // multi-seleção com Ctrl
let dimDraftP1=null, dimDraftP2=null, dimHoverPt=null, dimMousePt=null, dimDraftAxis=null;
let setLeaderAnchorMode=null; // id do rótulo aguardando clique no canvas para definir a âncora da linha de chamada
let lastLabelClick=null;
// Snap targets for the manual dimension tool: every piso/mezanino corner,
// the lateral walls of each piso (including their inner face), any internal
// wall (hwall) or mezanino wall, the exact corners where those walls meet a
// lateral wall, and every freestanding wall's corners.
function rectIntersect(a,b){
  if(!a||!b)return null;
  const x0=Math.max(a.x,b.x), x1=Math.min(a.x+a.w,b.x+b.w);
  const y0=Math.max(a.y,b.y), y1=Math.min(a.y+a.h,b.y+b.h);
  if(x1<=x0||y1<=y0)return null;
  return{x:x0,y:y0,w:x1-x0,h:y1-y0};
}
function collectDimSnapPoints(){
  const items=[]; // cada item: {pt:[x,y], anchor:{kind,id,dx,dy}|null}
  const pushRect=(r,anchor)=>{if(!r)return;
    [[r.x,r.y],[r.x+r.w,r.y],[r.x,r.y+r.h],[r.x+r.w,r.y+r.h]].forEach(pt=>{
      items.push({pt, anchor: anchor ? {kind:anchor.kind, id:anchor.id, dx:pt[0]-anchor.ox, dy:pt[1]-anchor.oy} : null});
    });
  };
  const andar2=state.floorMode==='andar2';
  state.panels.forEach(p=>{
    if(isFloor2Panel(p)!==andar2)return; // só peças do andar sendo exibido agora
    const r=rectOf(p); const a={kind:'panel',id:p.id,ox:r.x,oy:r.y};
    pushRect(r,a);
    const ty=typeOf(p.typeId);if(!ty)return;
    const le=lateralEdges(p.rot);const w=p.walls||{l:"solid",r:"solid"};
    const lateralRects=[];
    [["l",le.l],["r",le.r]].forEach(([key,edge])=>{
      if(w[key]&&w[key]!=="none"){const lr=edgeRect(edge,r);pushRect(lr,a);lateralRects.push(lr);}
    });
    const hwR=ty.hwall?internalWallRect(p):null;
    const mzR=isMez(ty)?mezWallRect(p):null;
    if(hwR)pushRect(hwR,a);
    if(mzR)pushRect(mzR,a);
    // The point where an internal/mezanino wall actually meets a lateral
    // wall — its own bounding-box corners don't include this, since each
    // wall spans the panel's full width or full depth independently.
    lateralRects.forEach(lr=>{
      pushRect(rectIntersect(lr,hwR),a);
      pushRect(rectIntersect(lr,mzR),a);
    });
  });
  state.wallInstances.forEach(inst=>{
    const c=wallInstanceWorldCorners(inst);if(c)c.forEach(pt=>
      items.push({pt, anchor:{kind:'wall',id:inst.id,dx:pt[0]-inst.ax,dy:pt[1]-inst.ay}}));
  });
  return items;
}
function nearestDimSnapPoint(wx,wy,maxPx){
  const items=collectDimSnapPoints();
  let best=null,bestAnchor=null,bestD=(maxPx||16)/view.scale;
  items.forEach(({pt,anchor})=>{const d=Math.hypot(pt[0]-wx,pt[1]-wy);if(d<bestD){bestD=d;best=pt;bestAnchor=anchor;}});
  if(!best)return null;
  best.anchor=bestAnchor; // pendura a âncora no próprio ponto — quem só lê [0]/[1] nem percebe
  return best;
}
// Legacy geometry (kept only to migrate old saved projects that used the
// free-angle offset model) — given the two measured points and a
// perpendicular offset, returns the dimension line's endpoints.
function dimOffsetPointsLegacy(p1,p2,offset){
  const dx=p2[0]-p1[0], dy=p2[1]-p1[1];
  const len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;
  return[[p1[0]+nx*offset,p1[1]+ny*offset],[p2[0]+nx*offset,p2[1]+ny*offset]];
}
// Manual cotas always measure purely along X or Y — never diagonally.
// Picking the axis: whichever delta between the two points is larger wins.
function dimAxisOf(p1,p2){
  return Math.abs(p2[0]-p1[0]) >= Math.abs(p2[1]-p1[1]) ? "x" : "y";
}
// Given the measured points, axis ("x"/"y") and the dimension line's fixed
// coordinate along the OTHER axis (linePos), returns everything needed to
// draw it: the line's own endpoints and the true axis-projected length.
function dimAxisGeom(p1,p2,axis,linePos){
  if(axis==="x"){
    const x1=Math.min(p1[0],p2[0]), x2=Math.max(p1[0],p2[0]);
    return{lineP1:[x1,linePos],lineP2:[x2,linePos],len:Math.abs(p2[0]-p1[0])};
  }
  const y1=Math.min(p1[1],p2[1]), y2=Math.max(p1[1],p2[1]);
  return{lineP1:[linePos,y1],lineP2:[linePos,y2],len:Math.abs(p2[1]-p1[1])};
}
// Migrates a saved manual dim into the current axis-locked model. Newer
// saves already have {axis,linePos}; older ones (free-angle offset) get
// converted by projecting their old dimension line onto the chosen axis.
function normalizeManualDim(d){
  if(d.axis && d.linePos!==undefined){
    return{id:d.id||uid(), p1:d.p1, p2:d.p2, axis:d.axis, linePos:d.linePos,
      p1Anchor:d.p1Anchor||null, p2Anchor:d.p2Anchor||null, andar:d.andar||1};
  }
  const axis=dimAxisOf(d.p1,d.p2);
  let linePos;
  if(d.offset!==undefined){
    const[q1]=dimOffsetPointsLegacy(d.p1,d.p2,d.offset);
    linePos=axis==="x"?q1[1]:q1[0];
  } else {
    linePos=axis==="x"?d.p1[1]:d.p1[0];
  }
  return{id:d.id||uid(), p1:d.p1, p2:d.p2, axis, linePos, p1Anchor:null, p2Anchor:null, andar:d.andar||1};
}
// Resolve a posição ATUAL de uma âncora (painel ou parede avulsa). Como
// painéis só giram em múltiplos de 90°, um deslocamento (dx,dy) fixo a
// partir da origem do retângulo do painel continua exato mesmo depois de
// o painel ser movido — só deixa de ser exato se o painel for excluído
// (nesse caso devolve null e quem chamou cai no ponto fixo salvo).
function resolveAnchorPoint(anchor){
  if(!anchor) return null;
  if(anchor.kind==='panel'){
    const p=state.panels.find(x=>x.id===anchor.id);
    if(!p) return null;
    const r=rectOf(p);
    return [r.x+anchor.dx, r.y+anchor.dy];
  }
  if(anchor.kind==='wall'){
    const wi=state.wallInstances.find(x=>x.id===anchor.id);
    if(!wi) return null;
    return [wi.ax+anchor.dx, wi.ay+anchor.dy];
  }
  return null;
}
// Ponto efetivo (p1 ou p2) de uma cota manual "agora" — usa a âncora,
// se existir e a referência ainda existir; senão cai no ponto fixo salvo
// (cotas antigas, sem âncora, continuam funcionando como antes).
function resolveDimPoint(d, which){
  const anchor = which==='p1' ? d.p1Anchor : d.p2Anchor;
  return resolveAnchorPoint(anchor) || d[which];
}
// Turns a free mouse position into a "magnetic" + gridded line position:
// first tries to snap into perfect alignment with any other existing cota
// that shares the same axis (so chained cotas line up into one straight
// row), and otherwise snaps to a 10cm grid instead of landing anywhere.
function getSnappedLinePos(axis,rawPos,excludeId){
  const pxTol=10/Math.max(view.scale,1);
  let best=null,bestDist=pxTol;
  (state.manualDims||[]).forEach(e=>{
    if(e.id===excludeId||e.axis!==axis||(e.andar||1)!==(state.floorMode==='andar2'?2:1))return;
    const dist=Math.abs(e.linePos-rawPos);
    if(dist<bestDist){bestDist=dist;best=e.linePos;}
  });
  if(best!==null)return best;
  return snap(rawPos);
}
let drag=null, dragInitialState=null, ghostPos=null, ghostRot=0;
let clipboard = null; 
let historyStack = [];
let redoStack = [];

function saveState() {
  if(historyStack.length > 50) historyStack.shift();
  historyStack.push(JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims||[]}));
  redoStack = []; // nova ação apaga o histórico de redo
}
function undo() {
  if(!historyStack.length) return;
  // salva estado atual no redoStack antes de desfazer
  redoStack.push(JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims||[]}));
  if(redoStack.length > 50) redoStack.shift();
  const last = JSON.parse(historyStack.pop());
  state.panels = last.panels;
  state.labels = last.labels;
  state.wallInstances = last.wallInstances || [];
  state.manualDims = last.manualDims || [];
  selId = null; selIds = new Set();
  renderInv();
  renderTabs();
  render();
  toast("Ação desfeita");
}
function redo() {
  if(!redoStack.length) return;
  historyStack.push(JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims||[]}));
  if(historyStack.length > 50) historyStack.shift();
  const next = JSON.parse(redoStack.pop());
  state.panels = next.panels;
  state.labels = next.labels;
  state.wallInstances = next.wallInstances || [];
  state.manualDims = next.manualDims || [];
  selId = null; selIds = new Set();
  renderInv();
  renderTabs();
  render();
  toast("Ação refeita");
}

const svg=document.getElementById("canvas");
const SVGNS="http://www.w3.org/2000/svg";
const el=(t,a={})=>{const n=document.createElementNS(SVGNS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function typeOf(id){return state.types.find(t=>t.id===id);}
function isMez(ty){return !!(ty&&ty.mezanino);}
// ── SEGUNDO ANDAR ────────────────────────────────────────────────────────
// Um painel é "do 2º andar" quando seu tipo é mezanino OU escada. Só existe
// (e só é editável) dentro do modo 2º andar — ver state.floorMode/
// setFloorMode. Fora desse modo (1º andar, PDF), painéis do 2º andar
// simplesmente não são desenhados nem selecionáveis.
function isFloor2Type(ty){return !!(ty&&(isMez(ty)||ty.isStair));}
function isFloor2Panel(p){return isFloor2Type(typeOf(p&&p.typeId));}
// Alvos de snap do 2º andar: centro de cada piso do 1º andar (pra
// centralizar o mezanino), o retângulo de cada parede horizontal (hwall)
// de um piso do 1º andar, e o retângulo de cada painel avulso do tipo
// "Parede" (state.wallInstances) do 1º andar — pra encostar a borda do
// mezanino neles.
function floor1SnapTargets(){
  const centers=[], hwalls=[];
  state.panels.forEach(p=>{
    if(isFloor2Panel(p))return; // só peças do 1º andar servem de referência
    const ty=typeOf(p.typeId);if(!ty)return;
    const r=rectOf(p);
    centers.push({cx:r.x+r.w/2,cy:r.y+r.h/2});
    if(ty.hwall){
      const hw=internalWallRect(p);
      if(hw)hwalls.push(hw);
    }
  });
  // Painéis do tipo "Parede" (avulsos, state.wallInstances) do 1º andar —
  // pedido explícito: o mezanino também deve encostar/snapar neles.
  state.wallInstances.forEach(wi=>{
    const wr=wallAABB(wi);
    if(wr)hwalls.push(wr);
  });
  return{centers,hwalls};
}
// Snap da posição do mezanino/escada quando posicionado no 2º andar:
// 1) (só mezanino — pedido explícito pra não valer em escada) aproxima o
//    centro do painel do centro de algum piso do 1º andar mais próximo, em
//    X OU em Y (o piso pode estar rotacionado 90°/"na vertical" — nesse caso
//    é o eixo Y que representa a largura dele, não X; por isso os dois eixos
//    são testados independentemente, em vez de assumir sempre X);
// 2) (só mezanino) aproxima a própria borda do mezanino (não há mais parede
//    externa separada — ver footD/mezWallRect) da parede horizontal (hwall)
//    de algum piso do 1º andar mais próxima, ou de um painel avulso do tipo
//    "Parede" (state.wallInstances) — de novo em X OU Y, pelo mesmo motivo
//    (com o piso na vertical, a parede dele "olha" para o lado, não para
//    cima/baixo);
// 3) encosta a borda do painel (mezanino OU escada) na borda de outro
//    painel do 2º andar já posicionado — é o que deixa, por exemplo, uma
//    escada levar direto até a borda do mezanino, sem vão entre os dois.
//    Mesmo princípio do snapToNeighbors do 1º andar, só que restrito aos
//    painéis do 2º andar entre si. Vale pros dois tipos.
// Foge para o grid comum quando nada está perto o bastante. excludeId evita
// que o próprio painel sendo arrastado se auto-encoste.
function snapAndar2Center(wx,wy,typeId,rot,excludeId,patamarLen){
  const ty=typeOf(typeId);if(!ty)return[snap(wx),snap(wy)];
  let cx=snap(wx), cy=snap(wy);
  const{centers,hwalls}=floor1SnapTargets();
  // Tolerância alinhada com o resto do app (TOL, a mesma usada pelo snap de
  // painéis/paredes do 1º andar) — a antiga (0.12m) era bem menor que os
  // outros snaps do app, o que fazia esse snap parecer "sutil demais"/quase
  // imperceptível.
  const TOLC=TOL;
  if(isMez(ty)){
    let bestCx=null,bestDx=TOLC, bestCy=null,bestDy=TOLC;
    centers.forEach(c=>{
      const ddx=Math.abs(c.cx-cx);if(ddx<bestDx){bestDx=ddx;bestCx=c.cx;}
      const ddy=Math.abs(c.cy-cy);if(ddy<bestDy){bestDy=ddy;bestCy=c.cy;}
    });
    if(bestCx!==null)cx=bestCx;
    if(bestCy!==null)cy=bestCy;

    // Não há mais parede externa própria do mezanino: encosta a borda do
    // footprint do próprio mezanino (área marrom) nas paredes de referência.
    const d0=dims({typeId,rot});
    if(d0.w&&d0.h){
      const mrx0=cx-d0.w/2, mry0=cy-d0.h/2;
      const myXs=[mrx0,mrx0+d0.w], myYs=[mry0,mry0+d0.h];
      let bestWDx=TOLC,bestCxW=null, bestWDy=TOLC,bestCyW=null;
      hwalls.forEach(hw=>{
        // tenta encostar cada borda do mezanino em cada borda da parede de
        // referência, testando X e Y separadamente (não assume orientação fixa).
        const hwXs=[hw.x,hw.x+hw.w], hwYs=[hw.y,hw.y+hw.h];
        hwXs.forEach(hwX=>myXs.forEach(mX=>{const dd=Math.abs(hwX-mX);if(dd<bestWDx){bestWDx=dd;bestCxW=cx+(hwX-mX);}}));
        hwYs.forEach(hwY=>myYs.forEach(mY=>{const dd=Math.abs(hwY-mY);if(dd<bestWDy){bestWDy=dd;bestCyW=cy+(hwY-mY);}}));
      });
      if(bestCxW!==null)cx=bestCxW;
      if(bestCyW!==null)cy=bestCyW;
    }
  }
  // Encosta na borda de outro painel do 2º andar (mezanino/escada), em X e Y
  // independentemente.
  const d=dims({typeId,rot,patamarLen:(ty.isStair&&ty.patamar)?(patamarLen!=null?patamarLen:(ty.patamarComprimento||0.9)):undefined});
  if(d.w&&d.h){
    const me={x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h};
    const myXs=[me.x,me.x+me.w], myYs=[me.y,me.y+me.h];
    let bx=null,bdx=TOLC, by=null,bdy=TOLC;
    state.panels.forEach(o=>{
      if(o.id===excludeId||!isFloor2Panel(o))return;
      const r=rectOf(o);
      [r.x,r.x+r.w].forEach(ox=>myXs.forEach(mx=>{const dd=Math.abs(ox-mx);if(dd<bdx){bdx=dd;bx=cx+(ox-mx);}}));
      [r.y,r.y+r.h].forEach(oy=>myYs.forEach(my=>{const dd=Math.abs(oy-my);if(dd<bdy){bdy=dd;by=cy+(oy-my);}}));
    });
    if(bx!==null)cx=bx;
    if(by!==null)cy=by;
  }
  return[cx,cy];
}
// Painéis do 2º andar não colidem com painéis do 1º andar (andares
// diferentes) — só entre si (dois mezaninos/escadas não podem se sobrepor).
function floor2OverlapsAny(cx,cy,d,excludeId){
  const me={x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h};
  return state.panels.some(o=>o.id!==excludeId && isFloor2Panel(o) && rectsOverlap(me,rectOf(o)));
}
// Total footprint depth of a type: apenas ty.d — o mezanino não tem mais
// faixa de parede própria somada ao footprint (parede externa removida a
// pedido; ver mezWallRect/mezWallRects/rebuildScene3D).
function footD(ty){return ty?ty.d:0;}
// Comprimento do patamar de uma escada, para esta instância específica: usa o
// valor salvo na instância (editável no canvas), caindo para o padrão
// cadastrado no tipo quando ausente. Independente do comprimento da corrida
// (ty.d), que é sempre só a parte "sobe" da escada.
function stairPatamarLen(p){
  const ty=typeOf(p.typeId);
  if(!ty||!ty.isStair||!ty.patamar) return 0;
  return Math.max(0.3, p.patamarLen!=null?p.patamarLen:(ty.patamarComprimento||0.9));
}
function dims(p){const ty=typeOf(p.typeId);if(!ty)return{w:0,h:0};
  const D=footD(ty)+(ty.isStair?stairPatamarLen(p):0);
  return (p.rot%180===0)?{w:ty.w,h:D}:{w:D,h:ty.w};}
function rectOf(p){const d=dims(p);return{x:p.cx-d.w/2,y:p.cy-d.h/2,w:d.w,h:d.h};}
const snap=v=>Math.round(v/SNAP)*SNAP;
const toScreen=(wx,wy)=>[wx*view.scale+view.tx, wy*view.scale+view.ty];
function toWorld(mx, my){
  const r = svg.getBoundingClientRect();
  return[(mx - r.left - view.tx)/view.scale, (my - r.top - view.ty)/view.scale];
}
function occupiedArea(){let a=0;state.panels.forEach(p=>{const ty=typeOf(p.typeId);if(ty&&!ty.isStair)a+=ty.w*ty.d;});return a;}
function contentBBox(){
  if(!state.panels.length&&!state.labels.length&&!state.wallInstances.length)return{x:0,y:0,w:9,h:7};
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  state.panels.forEach(p=>{const r=rectOf(p);x0=Math.min(x0,r.x);y0=Math.min(y0,r.y);x1=Math.max(x1,r.x+r.w);y1=Math.max(y1,r.y+r.h);});
  state.labels.forEach(l=>{x0=Math.min(x0,l.x-1);y0=Math.min(y0,l.y-.3);x1=Math.max(x1,l.x+1);y1=Math.max(y1,l.y+.3);});
  state.wallInstances.forEach(inst=>{const corners=wallInstanceWorldCorners(inst);if(!corners)return;
    corners.forEach(([cx,cy])=>{x0=Math.min(x0,cx);y0=Math.min(y0,cy);x1=Math.max(x1,cx);y1=Math.max(y1,cy);});});
  return{x:x0,y:y0,w:Math.max(x1-x0,1),h:Math.max(y1-y0,1)};
}
function lateralEdges(rot){switch(((rot%360)+360)%360){
  case 0:   return{l:"W",r:"E"};
  case 90:  return{l:"N",r:"S"};
  case 180: return{l:"E",r:"W"};
  default:  return{l:"S",r:"N"};}}
function edgeRect(edge,r,wallThick){const wt=wallThick||WALL;switch(edge){
  case "W": return{x:r.x,y:r.y,w:wt,h:r.h};
  case "E": return{x:r.x+r.w-wt,y:r.y,w:wt,h:r.h};
  case "N": return{x:r.x,y:r.y,w:r.w,h:wt};
  default:  return{x:r.x,y:r.y+r.h-wt,w:r.w,h:wt};}}
// Lateral wall with a window esquadria from x0..x1 metres along the wall.
// Renders two solid blocks + a glass segment (same look as windowBlocks).
function lateralEsqBlocks(edge,r,x0,x1,wallThick){
  // Janela lateral: mesmo visual da janela horizontal (ESQ_FILL + linhas brancas)
  // x0=x1=0 significa a parede inteira como janela
  const wt=wallThick||WALL;
  const segs=[];
  const dark="#1C1F24";
  if(edge==="W"||edge==="E"){
    const ex=(edge==="W")?r.x:(r.x+r.w-wt);
    // Se x0===x1===0, usa a parede toda; caso contrário usa o intervalo especificado
    const useAll=(x0===0&&x1===0);
    const g0=useAll?r.y:(r.y+x0);
    const g1=useAll?(r.y+r.h):(r.y+x1);
    if(g0>r.y)segs.push({x:ex,y:r.y,w:wt,h:g0-r.y,fill:dark});
    segs.push({x:ex,y:g0,w:wt,h:g1-g0,fill:ESQ_FILL,isWindow:true,isEsq:true});
    if(g1<r.y+r.h)segs.push({x:ex,y:g1,w:wt,h:r.y+r.h-g1,fill:dark});
  } else {
    const ey=(edge==="N")?r.y:(r.y+r.h-wt);
    const useAll=(x0===0&&x1===0);
    const g0=useAll?r.x:(r.x+x0);
    const g1=useAll?(r.x+r.w):(r.x+x1);
    if(g0>r.x)segs.push({x:r.x,y:ey,w:g0-r.x,h:wt,fill:dark});
    segs.push({x:g0,y:ey,w:g1-g0,h:wt,fill:ESQ_FILL,isWindow:true,isEsq:true});
    if(g1<r.x+r.w)segs.push({x:g1,y:ey,w:r.x+r.w-g1,h:wt,fill:dark});
  }
  return segs;
}
function openBlocks(edge,r,wallThick){const WALL_=wallThick||WALL;
  const corr=0.045, perp=0.09, pitch=corr+0.44, segs=[];
  if(edge==="W"||edge==="E"){const x=(edge==="W")?r.x:(r.x+r.w-perp);
    for(let s=0;s+corr<=r.h+1e-6;s+=pitch)segs.push({x,y:r.y+s,w:perp,h:corr});}
  else {const y=(edge==="N")?r.y:(r.y+r.h-perp);
    for(let s=0;s+corr<=r.w+1e-6;s+=pitch)segs.push({x:r.x+s,y,w:corr,h:perp});}
  return segs;
}
function rotPoint(x,y,rot){switch(((rot%360)+360)%360){
  case 0:return[x,y];case 90:return[-y,x];case 180:return[-x,-y];default:return[y,-x];}}
function stripRect(p,W,ly0,ly1){
  const pts=[[-W/2,ly0],[W/2,ly0],[W/2,ly1],[-W/2,ly1]].map(([x,y])=>rotPoint(x,y,p.rot));
  const xs=pts.map(c=>c[0]+p.cx),ys=pts.map(c=>c[1]+p.cy),mnx=Math.min(...xs),mny=Math.min(...ys);
  return{x:mnx,y:mny,w:Math.max(...xs)-mnx,h:Math.max(...ys)-mny};
}
// Returns the local-coordinate X bounds [lxStart, lxEnd] of the hwall,
// honouring hwall.x0 / hwall.x1 (0-based from the panel's left edge).
// Falls back to the full panel width when the fields are absent.
function hwallLocalXRange(hwall, W){
  const lxStart = (hwall.x0 !== undefined ? hwall.x0 : 0) - W/2;
  const lxEnd   = (hwall.x1 !== undefined ? hwall.x1 : W) - W/2;
  return [lxStart, lxEnd];
}
function internalWallRect(p){
  const ty=typeOf(p.typeId);if(!ty||!ty.hwall)return null;
  const th=ty.hwall.th,deck=ty.hwall.deck,d=ty.d,W=ty.w;
  const [lxStart,lxEnd]=hwallLocalXRange(ty.hwall,W);
  const ly0=d/2-deck-th, ly1=d/2-deck;
  const pts=[[lxStart,ly0],[lxEnd,ly0],[lxEnd,ly1],[lxStart,ly1]].map(([x,y])=>rotPoint(x,y,p.rot));
  const xs=pts.map(c=>c[0]+p.cx),ys=pts.map(c=>c[1]+p.cy);
  const mnx=Math.min(...xs),mny=Math.min(...ys);
  return{x:mnx,y:mny,w:Math.max(...xs)-mnx,h:Math.max(...ys)-mny};
}
// lxStart / lxEnd are optional local-coordinate bounds that restrict the wall
// to a sub-range of the full panel width.  When omitted the wall runs from
// -W/2 to W/2 (legacy behaviour).
function wallStripRects(p,W,ly0,ly1,esquadrias,lxStart,lxEnd){
  const dark="#1C1F24";
  if(lxStart===undefined) lxStart=-W/2;
  if(lxEnd===undefined)   lxEnd=W/2;
  const esqs=(esquadrias||[]).slice().sort((a,b)=>a.x-b.x);
  const seg=(lx,lxE)=>{
    if(lxE<=lx+1e-6)return null;
    const pts=[[lx,ly0],[lxE,ly0],[lxE,ly1],[lx,ly1]].map(([x,y])=>rotPoint(x,y,p.rot));
    const xs=pts.map(c=>c[0]+p.cx),ys=pts.map(c=>c[1]+p.cy);
    const mnx=Math.min(...xs),mny=Math.min(...ys);
    return{x:mnx,y:mny,w:Math.max(...xs)-mnx,h:Math.max(...ys)-mny,fill:dark};
  };
  const rects=[];let cur=lxStart;
  for(const e of esqs){
    const ex=e.x-W/2;
    if(ex>=lxEnd)break;
    const exEnd=Math.min(ex+e.w,lxEnd);
    if(exEnd<=lxStart)continue;
    const wallSegEnd=Math.min(Math.max(ex,lxStart),lxEnd);
    const r=seg(cur,wallSegEnd);if(r)rects.push(r);
    cur=Math.max(cur,exEnd);
  }
  const r=seg(cur,lxEnd);if(r)rects.push(r);
  return rects;
}
function wallStripEsqRects(p,W,ly0,th,esquadrias,lxStart,lxEnd){
  if(lxStart===undefined) lxStart=-W/2;
  if(lxEnd===undefined)   lxEnd=W/2;
  const esqs=(esquadrias||[]).slice().sort((a,b)=>a.x-b.x);
  const rects=[];
  for(const e of esqs){
    const ex=e.x-W/2,exEnd=Math.min(ex+e.w,W/2);
    // Skip esquadrias entirely outside the wall X range
    if(ex>=lxEnd||exEnd<=lxStart)continue;
    const clippedStart=Math.max(ex,lxStart),clippedEnd=Math.min(exEnd,lxEnd);
    if(clippedEnd<=clippedStart+1e-6)continue;
    const lr=getLocalSubRect(p,clippedStart,ly0,clippedEnd-clippedStart,th);
    rects.push({...lr,fill:ESQ_FILL,isEsq:true});
  }
  return rects;
}
function wallStripEsqPaths(p,W,ly0,ly1,th,esquadrias,lxStart,lxEnd){
  if(!(esquadrias||[]).length)return[];
  if(lxStart===undefined) lxStart=-W/2;
  if(lxEnd===undefined)   lxEnd=W/2;
  const esqs=(esquadrias||[]).slice().sort((a,b)=>a.x-b.x);
  const paths=[];
  const toW=(lx,ly)=>{const[rx,ry]=rotPoint(lx,ly,p.rot);return[p.cx+rx,p.cy+ry];};
  for(const e of esqs){
    const ex=e.x-W/2;
    const exEnd=Math.min(ex+e.w,W/2);
    // Skip esquadrias entirely outside the wall X range
    if(ex>=lxEnd||exEnd<=lxStart)continue;
    if(exEnd<=ex+1e-6)continue;
    const tp=e.type||"janela";
    if(tp==="janela"){
      const y1=ly0+th*0.3, y2=ly0+th*0.7;
      paths.push({kind:"line",p1:toW(ex,y1),p2:toW(exEnd,y1),stroke:"#FFFFFF",sw:0.7});
      paths.push({kind:"line",p1:toW(ex,y2),p2:toW(exEnd,y2),stroke:"#FFFFFF",sw:0.7});
    } else if(tp==="porta_giro"){
      const hingeX = (e.hinge==="direita") ? exEnd : ex;
      const arcEndX = (e.hinge==="direita") ? ex : exEnd;
      // dir: -1 = toward the floor area (dentro), +1 = toward the deck (fora)
      const dir = (e.opens==="dentro") ? -1 : 1;
      const hinge=toW(hingeX,ly0);
      const tip=toW(hingeX,ly0+dir*e.w);
      const arcEnd=toW(arcEndX,ly0);
      paths.push({kind:"doorArc",hinge,tip,arcEnd,r:e.w,fill:"#F4ECE2",stroke:"#1C1F24"});
      paths.push({kind:"line",p1:hinge,p2:tip,stroke:"#1C1F24",sw:1.2});
    } else if(tp==="porta_correr"){
      const x1=ex+e.w*0.18, x2=ex+e.w*0.52;
      paths.push({kind:"line",p1:toW(x1,ly0-0.02),p2:toW(x1,ly1+0.02),stroke:"#1C1F24",sw:1.2});
      paths.push({kind:"line",p1:toW(x2,ly0-0.02),p2:toW(x2,ly1+0.02),stroke:"#1C1F24",sw:1.2});
      const midY=ly0+th*0.5;
      paths.push({kind:"line",p1:toW(ex+e.w*0.06,midY),p2:toW(exEnd-e.w*0.06,midY),stroke:"#1C1F24",sw:0.5});
      paths.push({kind:"arrow",p1:toW(ex+e.w*0.06,midY),p2:toW(exEnd-e.w*0.06,midY),stroke:"#1C1F24"});
    } else if(tp==="porta_correr_1"){
      // Porta de correr 1 folha: folha ocupa metade, trilho + seta
      const x1=ex+e.w*0.04, x2=ex+e.w*0.54;
      paths.push({kind:"line",p1:toW(x1,ly0-0.02),p2:toW(x1,ly1+0.02),stroke:"#1C1F24",sw:1.2});
      const midY=ly0+th*0.5;
      paths.push({kind:"line",p1:toW(ex+e.w*0.04,midY),p2:toW(exEnd-e.w*0.06,midY),stroke:"#1C1F24",sw:0.5});
      paths.push({kind:"arrow",p1:toW(ex+e.w*0.04,midY),p2:toW(exEnd-e.w*0.06,midY),stroke:"#1C1F24"});
    } else if(tp==="abertura"){
      // Abertura: apenas preenchimento marrom claro, sem linhas adicionais
    }
    if(e.name&&e.showName!==false){
      const midX=(ex+exEnd)/2;
      paths.push({kind:"text",pos:toW(midX,ly0-0.18),text:e.name,fontSize:10,fill:"#1C1F24"});
    }
  }
  return paths;
}
function internalWallRects(p){
  const ty=typeOf(p.typeId);if(!ty||!ty.hwall)return[];
  const th=ty.hwall.th,deck=ty.hwall.deck,d=ty.d,W=ty.w;
  const [lxStart,lxEnd]=hwallLocalXRange(ty.hwall,W);
  return wallStripRects(p,W,d/2-deck-th,d/2-deck,ty.hwall.esquadrias,lxStart,lxEnd);
}
function internalEsqRects(p){
  const ty=typeOf(p.typeId);if(!ty||!ty.hwall)return[];
  const th=ty.hwall.th,deck=ty.hwall.deck,d=ty.d,W=ty.w;
  const [lxStart,lxEnd]=hwallLocalXRange(ty.hwall,W);
  return wallStripEsqRects(p,W,d/2-deck-th,th,ty.hwall.esquadrias,lxStart,lxEnd);
}
function internalEsqPaths(p){
  const ty=typeOf(p.typeId);
  if(!ty||!ty.hwall||!(ty.hwall.esquadrias||[]).length)return[];
  const th=ty.hwall.th,deck=ty.hwall.deck,d=ty.d,W=ty.w;
  const [lxStart,lxEnd]=hwallLocalXRange(ty.hwall,W);
  return wallStripEsqPaths(p,W,d/2-deck-th,d/2-deck,th,ty.hwall.esquadrias,lxStart,lxEnd);
}
function getRotatedSubRect(p, ly, lh) {
  const ty = typeOf(p.typeId);
  const pts = [
    [-ty.w/2, ly], [ty.w/2, ly],
    [ty.w/2, ly+lh], [-ty.w/2, ly+lh]
  ].map(([x,y])=>rotPoint(x,y,p.rot));
  const xs=pts.map(c=>c[0]+p.cx), ys=pts.map(c=>c[1]+p.cy);
  const mnx=Math.min(...xs), mny=Math.min(...ys);
  return {x: mnx, y: mny, w: Math.max(...xs)-mnx, h: Math.max(...ys)-mny};
}
function getLocalSubRect(p, lx, ly, lw, lh) {
  const pts = [
    [lx, ly], [lx+lw, ly],
    [lx+lw, ly+lh], [lx, ly+lh]
  ].map(([x,y])=>rotPoint(x,y,p.rot));
  const xs=pts.map(c=>c[0]+p.cx), ys=pts.map(c=>c[1]+p.cy);
  const mnx=Math.min(...xs), mny=Math.min(...ys);
  return {x: mnx, y: mny, w: Math.max(...xs)-mnx, h: Math.max(...ys)-mny};
}
// Mezanino: antes tinha uma faixa de parede (ty.mezanino.th) somada além da
// área marrom-claro (ty.w x ty.d), na borda de trás. Essa parede externa foi
// removida a pedido — o mezanino agora é só a área marrom, sem parede própria
// e sem esquadrias nela. As funções abaixo ficam mantidas (mesma assinatura)
// só retornando "sem parede", pra não precisar mexer em todo call site que
// já lida com o caso null/[] (collectWallSnapLines, panelWallRects etc).
function mezWallYRange(ty){return[ty.d/2,ty.d/2];}
function mezWallRect(p){return null;}
function mezWallRects(p){return[];}
function mezEsqRects(p){return[];}
function mezEsqPaths(p){return[];}
function pisoParts(p){
  const ty=typeOf(p.typeId);const r=rectOf(p);
  const dark="#1C1F24";const rects=[];
  const D=footD(ty);

  if(ty && ty.hwall){
    const th=ty.hwall.th, deck=ty.hwall.deck;
    const ly0 = ty.d/2 - deck - th;
    const ly1 = ty.d/2 - deck;
    const twoTone = ty.hwall.twoTone !== false; // default: dois tons
    if(twoTone) {
      // Claro cobre toda a área acima do deck (piso + faixa da parede)
      // → a faixa sem parede fica marrom claro em vez de transparente
      const p1 = getRotatedSubRect(p, -ty.d/2, (ty.d - deck));
      rects.push({...p1, fill: WOOD_L, floor:true});
      // Escuro cobre apenas a área do deck (abaixo da parede)
      const p2 = getRotatedSubRect(p, ly1, ty.d/2 - ly1);
      rects.push({...p2, fill: WOOD_D, floor:true});
    } else {
      // Tom único: piso inteiro em marrom claro
      const p1 = getRotatedSubRect(p, -ty.d/2, ty.d);
      rects.push({...p1, fill: WOOD_L, floor:true});
    }
  } else if(ty && isMez(ty)){
    const[wly0]=mezWallYRange(ty);
    const p1 = getRotatedSubRect(p, -D/2, wly0-(-D/2));
    rects.push({...p1, fill: WOOD_L, floor:true});
  } else if(ty && ty.isStair){
    // ── Escada Santos Dumont: corpo em concreto claro; detalhes abaixo ────
    rects.push({x:r.x,y:r.y,w:r.w,h:r.h,fill:"#CFC8B8", floor:true});
  } else {
    rects.push({x:r.x,y:r.y,w:r.w,h:r.h,fill:ty?ty.color:WOOD_L, floor:true});
  }

  const le=lateralEdges(p.rot);const w=p.walls||{l:"solid",r:"solid"};
  const wallThick=ty&&ty.wallThick||WALL;
  [["l",le.l],["r",le.r]].forEach(([key,edge])=>{const v=w[key];if(!v||v==="none")return;
    if(v==="open")openBlocks(edge,r,wallThick).forEach(s=>rects.push({...s,fill:dark}));
    else if(v==="window"){
      // Janela lateral: aparência igual à janela horizontal (preenchimento marrom + linhas brancas)
      lateralEsqBlocks(edge,r,0,0,wallThick).forEach(s=>rects.push(s));
    }
    else if(ty&&ty.lateralEsq&&ty.lateralEsq.enabled){
      // Parede com esquadria lateral – verifica qual lateral deve receber a esquadria
      const esqSide=ty.lateralEsq.side||"ambas";
      const sideMatch=(esqSide==="ambas")||(esqSide==="esq"&&key==="l")||(esqSide==="dir"&&key==="r");
      if(sideMatch){
        lateralEsqBlocks(edge,r,ty.lateralEsq.x0||0.535,ty.lateralEsq.x1||0.965,wallThick)
          .forEach(s=>rects.push(s));
      } else {
        const er=edgeRect(edge,r,wallThick);
        rects.push({x:er.x,y:er.y,w:er.w,h:er.h,fill:dark});
      }
    }
    else{const er=edgeRect(edge,r,wallThick);rects.push({x:er.x,y:er.y,w:er.w,h:er.h,fill:dark});}});
  
  const c=p.corners||{},ps=POST;
  const wl = (!w.l || w.l === "none");
  const wr = (!w.r || w.r === "none");
  const addCorner = (cx, cy) => {
    const [rcx, rcy] = rotPoint(cx, cy, p.rot);
    rects.push({x: p.cx + rcx - ps/2, y: p.cy + rcy - ps/2, w: ps, h: ps, fill: dark});
  };
  if(ty){
    if(c.tl && wl) addCorner(-ty.w/2 + ps/2, -D/2 + ps/2);
    if(c.tr && wr) addCorner(ty.w/2 - ps/2, -D/2 + ps/2);
    if(c.bl && wl) addCorner(-ty.w/2 + ps/2, D/2 - ps/2);
    if(c.br && wr) addCorner(ty.w/2 - ps/2, D/2 - ps/2);
  }

  internalWallRects(p).forEach(r=>rects.push(r));
  internalEsqRects(p).forEach(r=>rects.push(r));
  mezWallRects(p).forEach(r=>rects.push(r));
  mezEsqRects(p).forEach(r=>rects.push(r));
  if(ty.lamina){const lr=getLocalSubRect(p,ty.lamina.lx,ty.lamina.ly,ty.lamina.lw,ty.lamina.lh);rects.push({...lr,fill:"#FFFFFF",isLamina:true});}
  const nm=p.name||{};

  // ── Escada Santos Dumont: degraus, longarinas, patamar e seta de subida ──
  if(ty && ty.isStair){
    const paths=[];
    const hasPatamar = !!ty.patamar;
    // ty.d é APENAS o comprimento da parte "sobe" (corrida com degraus).
    // O patamar é uma medida independente — mudar seu comprimento não afeta
    // a corrida, apenas estende/reduz o footprint total da escada.
    const corridaLen = ty.d;
    const patamarLen = hasPatamar ? stairPatamarLen(p) : 0;
    const totalD = corridaLen + patamarLen; // footprint total local (= r.h após rotação)
    const stepTread = 0.28; // profundidade padrão do degrau (m)
    const totalSteps = Math.max(3, Math.round(corridaLen/stepTread));
    const actualStep = corridaLen/totalSteps;
    const inset = Math.min(0.035, ty.w*0.12);

    // Longarinas laterais (vigas de borda) — faixas sólidas contínuas em toda a extensão
    rects.push({...getLocalSubRect(p, -ty.w/2, -totalD/2, inset, totalD), fill:"#8A8272"});
    rects.push({...getLocalSubRect(p,  ty.w/2-inset, -totalD/2, inset, totalD), fill:"#8A8272"});

    // Patamar sólido — concreto maciço, sem linhas de degrau, no fim da corrida
    if(hasPatamar){
      rects.push({...getLocalSubRect(p, -ty.w/2, totalD/2-patamarLen, ty.w, patamarLen), fill:"#A39A88"});
    }

    // Linhas de degrau (espelhos), no trecho de corrida — usa dimensões
    // LOCAIS com uma única rotação via rotPoint, para ficar correto em
    // qualquer rotação (0/90/180/270).
    for(let i=0;i<=totalSteps;i++){
      const ly=-totalD/2+i*actualStep;
      const p1=rotPoint(-ty.w/2+inset, ly, p.rot);
      const p2=rotPoint( ty.w/2-inset, ly, p.rot);
      paths.push({kind:"line",
        p1:[p.cx+p1[0], p.cy+p1[1]],
        p2:[p.cx+p2[0], p.cy+p2[1]],
        stroke: i===0 ? "rgba(255,255,255,0.9)" : "rgba(60,55,45,0.55)",
        sw: i===0 ? 2 : 1});
    }

    // Contorno do patamar (traço mais forte separando-o da corrida)
    if(hasPatamar){
      const pyTop=totalD/2-patamarLen;
      const ptl=rotPoint(-ty.w/2, pyTop, p.rot), ptr=rotPoint(ty.w/2, pyTop, p.rot);
      paths.push({kind:"line",p1:[p.cx+ptl[0],p.cy+ptl[1]],p2:[p.cx+ptr[0],p.cy+ptr[1]],stroke:"rgba(255,255,255,0.9)",sw:2});
    }

    // Seta "SOBE" indicando o sentido de subida, ao longo do eixo central
    const cyLocalStart = -totalD/2 + actualStep*0.6;
    const cyLocalEnd   = totalD/2 - patamarLen - actualStep*0.6;
    if(cyLocalEnd > cyLocalStart){
      const a1=rotPoint(0, cyLocalStart, p.rot);
      const a2=rotPoint(0, cyLocalEnd,   p.rot);
      paths.push({kind:"arrow", p1:[p.cx+a1[0],p.cy+a1[1]], p2:[p.cx+a2[0],p.cy+a2[1]], stroke:"#3A362E", sw:1.6});
      const tmid=rotPoint(0, (cyLocalStart+cyLocalEnd)/2, p.rot);
      paths.push({kind:"text", pos:[p.cx+tmid[0], p.cy+tmid[1]], text:"SOBE", fontSize:8, fill:"#3A362E"});
    }

    return{rects,paths,name:{x:p.cx+(nm.dx||0),y:p.cy+(nm.dy||0),text:nm.text||"",show:nm.show!==false}};
  }

  const paths=[...internalEsqPaths(p),...mezEsqPaths(p)];
  return{rects,paths,name:{x:p.cx+(nm.dx||0),y:p.cy+(nm.dy||0),text:nm.text||"",show:nm.show!==false}};
}

function wallTypeOf(id){return state.wallTypes.find(t=>t.id===id);}
function wallTypeRectInfo(wt){
  const length=Math.max(0,wt.length||0), thickness=Math.max(0,wt.thickness||0);
  const horizontal=thickness>length; 
  return{minX:0,maxX:thickness,minY:0,maxY:length,horizontal,length,thickness};
}
function wallTypeLength(wt){return wallTypeRectInfo(wt).length;}
function wallLocalRectToWorld(inst,lx0,lx1,ly0,ly1){
  const pts=[[lx0,ly0],[lx1,ly0],[lx1,ly1],[lx0,ly1]];
  return pts.map(([X,Yu])=>{
    const e=[X,-Yu]; 
    const r=rotPoint(e[0],e[1],inst.rot||0);
    return[inst.ax+r[0],inst.ay+r[1]];
  });
}
function wallLocalPtToWorld(inst,X,Yu){
  const e=[X,-Yu]; const r=rotPoint(e[0],e[1],inst.rot||0);
  return[inst.ax+r[0],inst.ay+r[1]];
}
function wallInstanceWorldCorners(inst){
  const wt=wallTypeOf(inst.wallTypeId);if(!wt)return null;
  const info=wallTypeRectInfo(wt);
  return wallLocalRectToWorld(inst,info.minX,info.maxX,info.minY,info.maxY);
}
function collectWallSnapLines(excludeWallInstId){
  const xs=[],ys=[];
  const addRect=(r)=>{if(!r)return;xs.push(r.x,r.x+r.w);ys.push(r.y,r.y+r.h);};
  state.panels.forEach(p=>{
    const r=rectOf(p);
    addRect(r); 
    const ty=typeOf(p.typeId);
    if(ty&&ty.hwall){addRect(internalWallRect(p));} 
    if(ty&&isMez(ty)){addRect(mezWallRect(p));}
    if(ty&&ty.lamina){addRect(getLocalSubRect(p,ty.lamina.lx,ty.lamina.ly,ty.lamina.lw,ty.lamina.lh));} 
    const w=p.walls||{l:"solid",r:"solid"};
    const le=lateralEdges(p.rot);
    if(w.l&&w.l!=="none")addRect(edgeRect(le.l,r));
    if(w.r&&w.r!=="none")addRect(edgeRect(le.r,r));
  });
  state.wallInstances.forEach(wi=>{
    if(wi.id===excludeWallInstId)return;
    const corners=wallInstanceWorldCorners(wi);if(!corners)return;
    const cxs=corners.map(c=>c[0]),cys=corners.map(c=>c[1]);
    xs.push(Math.min(...cxs),Math.max(...cxs));ys.push(Math.min(...cys),Math.max(...cys));
  });
  return{xs,ys};
}
function snapWallToNeighbors(inst,ax,ay,excludeWallInstId){
  const corners=wallInstanceWorldCorners({...inst,ax,ay});if(!corners)return[ax,ay];
  const cxs=corners.map(c=>c[0]),cys=corners.map(c=>c[1]);
  const myXs=[Math.min(...cxs),Math.max(...cxs)],myYs=[Math.min(...cys),Math.max(...cys)];
  const{xs:lineXs,ys:lineYs}=collectWallSnapLines(excludeWallInstId);
  let bx=null,bdx=TOL,by=null,bdy=TOL;
  lineXs.forEach(lx=>myXs.forEach(mx=>{const dd=Math.abs(lx-mx);if(dd<bdx){bdx=dd;bx=ax+(lx-mx);}}));
  lineYs.forEach(ly=>myYs.forEach(my=>{const dd=Math.abs(ly-my);if(dd<bdy){bdy=dd;by=ay+(ly-my);}}));
  return[bx??ax,by??ay];
}
function wallInstanceParts(inst){
  const wt=wallTypeOf(inst.wallTypeId);if(!wt)return{polys:[],paths:[]};
  const info=wallTypeRectInfo(wt);
  const dark="#1C1F24";
  const polys=[],paths=[];
  // Support multiple doors (doors[]) and legacy single door (door)
  const doors=(wt.doors&&wt.doors.length)?wt.doors:(wt.door?[wt.door]:[]);
  const subRect=(t0,t1)=>{
    if(info.horizontal){
      return{lx0:t0,lx1:t1,ly0:info.minY,ly1:info.maxY};
    } else {
      return{lx0:info.minX,lx1:info.maxX,ly0:t0,ly1:t1};
    }
  };
  const pushRect=(r)=>polys.push({pts:wallLocalRectToWorld(inst,r.lx0,r.lx1,r.ly0,r.ly1),fill:dark});

  if(doors.length>0){
    const L=info.length;
    const sorted=doors.slice().sort((a,b)=>a.at-b.at);
    // Solid segments between/around doors
    let cur=0;
    for(const d of sorted){
      const at2=Math.max(0,Math.min(L,d.at)),w2=Math.max(0,Math.min(L-at2,d.w));
      if(at2>cur+0.001)pushRect(subRect(cur,at2));
      cur=Math.max(cur,at2+w2);
    }
    if(cur<L-0.001)pushRect(subRect(cur,L));
    // Door arcs
    const faceShort=info.horizontal?info.minY:info.minX;
    for(const door of sorted){
      const at=Math.max(0,Math.min(L,door.at)),w=Math.max(0,Math.min(L-at,door.w));
      const isFirst=(door===sorted[0]);
      const effectiveOpens=isFirst?(inst.doorOpens||door.opens):door.opens;
      const effectiveHinge=isFirst?(inst.doorHinge||door.hinge):door.hinge;
      const usingInstOverride=isFirst&&!!(inst.doorOpens||inst.doorHinge);
      const renderHinge=(usingInstOverride&&effectiveOpens==="fora")
        ?(effectiveHinge==="esquerda"?"direita":"esquerda")
        :effectiveHinge;
      const hingeT=(renderHinge==="direita")?(at+w):at;
      const arcEndT=(renderHinge==="direita")?at:(at+w);
      const dir=(effectiveOpens==="dentro")?-1:1;
      let hingeLocal,tipLocal,arcEndLocal;
      if(info.horizontal){
        hingeLocal=[hingeT,faceShort];arcEndLocal=[arcEndT,faceShort];tipLocal=[hingeT,faceShort+dir*w];
      } else {
        hingeLocal=[faceShort,hingeT];arcEndLocal=[faceShort,arcEndT];tipLocal=[faceShort+dir*w,hingeT];
      }
      const hinge=wallLocalPtToWorld(inst,...hingeLocal),arcEnd=wallLocalPtToWorld(inst,...arcEndLocal),tip=wallLocalPtToWorld(inst,...tipLocal);
      const doorTipo=door.tipo||"porta_giro";
      if(doorTipo==="abertura"){
        // Abertura: preenchimento marrom claro (ESQ_FILL) na zona da abertura
        polys.push({pts:wallLocalRectToWorld(inst,...(info.horizontal?[at,at+w,info.minY,info.maxY]:[info.minX,info.maxX,at,at+w])),fill:ESQ_FILL});
      } else if(doorTipo==="porta_correr_1"){
        // Porta de correr 1 folha
        const _mid=info.horizontal?(info.minY+info.maxY)/2:(info.minX+info.maxX)/2;
        const _slabW=w*0.08;
        let lineA,lineB;
        if(info.horizontal){
          polys.push({pts:wallLocalRectToWorld(inst,at,at+_slabW,info.minY,info.maxY),fill:dark});
          lineA=wallLocalPtToWorld(inst,at,_mid);
          lineB=wallLocalPtToWorld(inst,at+w,_mid);
        } else {
          polys.push({pts:wallLocalRectToWorld(inst,info.minX,info.maxX,at,at+_slabW),fill:dark});
          lineA=wallLocalPtToWorld(inst,_mid,at);
          lineB=wallLocalPtToWorld(inst,_mid,at+w);
        }
        paths.push({kind:"line",p1:lineA,p2:lineB,stroke:dark,sw:0.5});
        paths.push({kind:"arrow",p1:lineA,p2:lineB,stroke:dark});
      } else {
        // porta_giro (padrão)
        paths.push({kind:"doorArc",hinge,tip,arcEnd,r:w,fill:"#F4ECE2",stroke:dark});
        paths.push({kind:"line",p1:hinge,p2:tip,stroke:dark,sw:1.2});
      }
      if(door.name&&door.showName!==false){
        const midT=at+w/2;
        const nameLocal=info.horizontal?[midT,faceShort-0.18]:[faceShort-0.18,midT];
        const pos2=wallLocalPtToWorld(inst,...nameLocal);
        paths.push({kind:"text",pos:pos2,text:door.name,fontSize:10,fill:dark});
      }
    }
  } else {
    pushRect({lx0:info.minX,lx1:info.maxX,ly0:info.minY,ly1:info.maxY});
  }
  return{polys,paths};
}
function doorArcSweep(hinge,tip,arcEnd){
  const bx=tip[0]-hinge[0], by=tip[1]-hinge[1];
  const cx=arcEnd[0]-hinge[0], cy=arcEnd[1]-hinge[1];
  const cross=bx*cy-by*cx;
  return cross<0?0:1;
}
// No modo escuro, a cor sólida das paredes (tanto dos painéis quanto das
// paredes avulsas) fica mais escura que no modo claro — só isso; os demais
// traços (portas, textos) continuam iguais ao modo claro. Usado só no
// canvas: as mesmas funções que geram esses "rects/paths" também alimentam
// o PDF (que não entende var(--...)), então a troca é feita aqui, no
// consumo, não na origem dos dados.
function themedFill(f){ return f==="#1C1F24" ? "var(--wall-fill)" : f; }
function appendPaths(target,paths,textSink){
  (paths||[]).forEach(pd=>{
    if(pd.kind==="line"){
      const[sx1,sy1]=toScreen(pd.p1[0],pd.p1[1]);const[sx2,sy2]=toScreen(pd.p2[0],pd.p2[1]);
      target.appendChild(el("line",{x1:sx1,y1:sy1,x2:sx2,y2:sy2,stroke:pd.stroke||"#1C1F24","stroke-width":pd.sw||1,"vector-effect":"non-scaling-stroke"}));
    } else if(pd.kind==="doorArc"){
      const[hx,hy]=toScreen(pd.hinge[0],pd.hinge[1]);
      const[tx,ty_]=toScreen(pd.tip[0],pd.tip[1]);
      const[ax,ay]=toScreen(pd.arcEnd[0],pd.arcEnd[1]);
      const r=pd.r*view.scale;
      const sweep=doorArcSweep(pd.hinge,pd.tip,pd.arcEnd);
      const d=`M ${hx} ${hy} L ${tx} ${ty_} A ${r} ${r} 0 0 ${sweep} ${ax} ${ay} Z`;
      target.appendChild(el("path",{d,fill:pd.fill||"none",stroke:pd.stroke||"#1C1F24","stroke-width":1,"vector-effect":"non-scaling-stroke","fill-opacity":"0.55"}));
    } else if(pd.kind==="arrow"){
      // Seta de porta de correr
      const[sx1,sy1]=toScreen(pd.p1[0],pd.p1[1]);const[sx2,sy2]=toScreen(pd.p2[0],pd.p2[1]);
      const dx=sx2-sx1,dy=sy2-sy1,len=Math.sqrt(dx*dx+dy*dy);
      if(len>2){
        const ux=dx/len,uy=dy/len;
        const ah=6,aw=4;
        // seta no final
        const ax=sx2-ux*ah,ay_=sy2-uy*ah;
        const arrowPts=`${sx2},${sy2} ${ax-uy*aw},${ay_+ux*aw} ${ax+uy*aw},${ay_-ux*aw}`;
        target.appendChild(el("line",{x1:sx1,y1:sy1,x2:sx2,y2:sy2,stroke:pd.stroke||"#1C1F24","stroke-width":pd.sw||0.7,"vector-effect":"non-scaling-stroke"}));
        target.appendChild(el("polygon",{points:arrowPts,fill:pd.stroke||"#1C1F24"}));
      }
    } else if(pd.kind==="text"){
      if(textSink){
        const[sx,sy]=toScreen(pd.pos[0],pd.pos[1]);
        textSink.push({sx,sy,text:pd.text||"",fontSize:pd.fontSize||10,fill:pd.fill||"#1C1F24"});
      } else {
        const[sx,sy]=toScreen(pd.pos[0],pd.pos[1]);
        const t=el("text",{x:sx,y:sy,fill:pd.fill||"#1C1F24","font-size":pd.fontSize||10,"font-family":"Montserrat, sans-serif","font-weight":600,"text-anchor":"middle",style:"pointer-events:none"});
        t.textContent=pd.text||"";
        target.appendChild(t);
      }
    }
  });
}

// Lays out a set of screen-space text labels (esquadria names) avoiding overlaps:
// alternates rows when two labels would collide, and wraps multi-word labels
// onto two lines when even the alternate row can't fit them.
function layoutEsqTexts(items, preBlocked=[]){
  const HGAP=4, VGAP=3;
  items.sort((a,b)=>a.sx-b.sx);
  // Seed with oitão bounding boxes so esquadria labels are pushed away from
  // them before the label-vs-label collision search even begins.
  const placedBoxes=preBlocked.map(b=>({x1:b.x1,y1:b.y1,x2:b.x2,y2:b.y2}));
  // Splits text into `parts` lines. Prefers breaking at spaces; falls back
  // to a raw character split when there aren't enough words to split on
  // (e.g. a single-word esquadria name) — so even those can still wrap
  // instead of just shifting further away.
  const splitInto=(text,parts)=>{
    const words=(text||"").split(" ");
    if(words.length>=parts){
      const lines=[];const per=Math.ceil(words.length/parts);
      for(let i=0;i<words.length;i+=per)lines.push(words.slice(i,i+per).join(" "));
      return lines.filter(Boolean);
    }
    const s=text||"";const per=Math.ceil(s.length/parts);
    const lines=[];
    for(let i=0;i<s.length;i+=per)lines.push(s.slice(i,i+per));
    return lines.filter(Boolean);
  };
  items.forEach(it=>{
    const fontSize=it.fontSize||10;
    const charW=fontSize*0.64;
    const text=it.text||"";
    const words=text.split(" ");
    // Variants in priority order: MOST wrapped (most compact / narrowest)
    // first, down to a single full line last. Compactness comes first —
    // we always try to break the label down as much as it makes sense
    // (one word per line, or short character chunks for a single long
    // word) before ever falling back to a wider layout.
    const variants=[];
    const seen=new Set();
    const maxParts=words.length>1 ? words.length : Math.min(4,Math.ceil(text.length/3)||1);
    for(let parts=maxParts;parts>=2;parts--){
      const lines=splitInto(text,parts);
      if(lines.length<2)continue;
      const key=lines.join("|");
      if(seen.has(key))continue;
      seen.add(key);
      variants.push({lines,width:Math.max(...lines.map(l=>l.length*charW))});
    }
    variants.push({lines:null,width:Math.max(text.length*charW,charW*2)});
    const lineH=fontSize+2;
    // For every variant, search a small grid of candidate offsets around
    // the esquadria's own anchor point — both axes, both directions —
    // sorted by actual distance, and use the first one that doesn't
    // collide with anything already placed. Horizontal moves are weighed
    // a bit more than vertical ones so the label prefers to slide up/down
    // (which reads naturally next to a wall) before drifting sideways.
    let best=null;
    for(const v of variants){
      const nLines=v.lines?v.lines.length:1;
      const boxW=v.width+HGAP*2;
      const boxH=lineH*nLines+VGAP*2;
      const xStep=boxW*0.55, yStep=lineH;
      const candidates=[];
      for(let mx=-3;mx<=3;mx++){
        for(let my=-4;my<=4;my++){
          const dx=mx*xStep, dy=my*yStep;
          candidates.push({dx,dy,dist:Math.hypot(dx*1.3,dy)});
        }
      }
      candidates.sort((a,b)=>a.dist-b.dist);
      for(const c of candidates){
        const cx=it.sx+c.dx, cy=it.sy+c.dy;
        const x1=cx-boxW/2, x2=cx+boxW/2;
        const y1=cy-fontSize*0.8-VGAP, y2=y1+boxH;
        const collide=placedBoxes.some(b=>x1<b.x2 && x2>b.x1 && y1<b.y2 && y2>b.y1);
        if(!collide){
          if(best===null || c.dist<best.dist){
            best={dist:c.dist,dx:c.dx,dy:c.dy,width:v.width,lines:v.lines,x1,y1,x2,y2};
          }
          break; // candidates sorted by distance — first free one is this variant's best
        }
      }
      if(best && best.dist===0)break; // already touching the esquadria — can't do better
    }
    if(!best){
      // Extremely crowded fallback (search grid exhausted): stack below
      // whatever is already placed in the same horizontal range.
      const v=variants[0];
      const nLines=v.lines?v.lines.length:1;
      const boxW=v.width+HGAP*2, boxH=lineH*nLines+VGAP*2;
      let dy=0;
      placedBoxes.forEach(b=>{ if(b.x1<it.sx+boxW/2 && b.x2>it.sx-boxW/2) dy=Math.max(dy,b.y2-it.sy); });
      const cy=it.sy+dy;
      best={dist:dy,dx:0,dy,width:v.width,lines:v.lines,x1:it.sx-boxW/2,y1:cy-fontSize*0.8-VGAP,x2:it.sx+boxW/2,y2:cy-fontSize*0.8-VGAP+boxH};
    }
    it.lines=best.lines;
    it.dx=best.dx;
    it.dy=best.dy;
    it.finalWidth=best.width;
    placedBoxes.push({x1:best.x1,y1:best.y1,x2:best.x2,y2:best.y2});
  });
  return items;
}
// Screen-space AABBs of free-standing wall instances, used to keep esquadria
// labels from landing on top of a wall (which makes them unreadable).
function wallScreenBoxes(){
  return state.wallInstances.map(wi=>{
    const a=wallAABB(wi);if(!a)return null;
    const[x1,y1]=toScreen(a.x,a.y);const[x2,y2]=toScreen(a.x+a.w,a.y+a.h);
    return{x:Math.min(x1,x2),y:Math.min(y1,y2),w:Math.abs(x2-x1),h:Math.abs(y2-y1)};
  }).filter(Boolean);
}
function boxesOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function drawEsqTexts(items, preBlocked=[]){
  if(!items.length)return;
  // pointer-events:none → cliques passam para os elementos de piso/parede abaixo
  const g=el("g",{"data-esqtexts":"1",style:"pointer-events:none"});
  const wBoxes=wallScreenBoxes();
  layoutEsqTexts(items, preBlocked).forEach(it=>{
    const lineH=(it.fontSize||10)+2;
    const nLines=it.lines?it.lines.length:1;
    const origSx=it.sx, origSy=it.sy;
    let cx=it.sx+(it.dx||0), cy=it.sy+(it.dy||0);
    // nudge further away if a free-standing wall sits right under the label
    for(let tries=0;tries<3;tries++){
      const box={x:cx-it.finalWidth/2-3,y:cy-(it.fontSize||10)*0.8,w:it.finalWidth+6,h:lineH*nLines+4};
      if(!wBoxes.some(b=>boxesOverlap(box,b)))break;
      cy+=lineH;
    }
    // Leader line: drawn only when the label had to move away from the anchor.
    if(Math.hypot(cx-origSx,cy-origSy)>4){
      g.appendChild(el("line",{
        x1:origSx,y1:origSy,x2:cx,y2:cy-(it.fontSize||10)*0.4,
        stroke:it.fill||"#1C1F24","stroke-width":1,"stroke-dasharray":"2 2",opacity:.55
      }));
    }
    const t=el("text",{x:cx,y:cy,fill:it.fill,
      stroke:"rgba(255,255,255,0.9)","stroke-width":"3","paint-order":"stroke fill",
      "font-size":it.fontSize,"font-family":"Montserrat, sans-serif","font-weight":600,"text-anchor":"middle"});
    if(it.lines){
      it.lines.forEach((ln,i)=>{
        const ts=el("tspan",{x:cx,dy:i===0?0:(it.fontSize+2)});
        ts.textContent=ln;t.appendChild(ts);
      });
    } else {
      t.textContent=it.text;
    }
    g.appendChild(t);
  });
  svg.appendChild(g);
}

function render(){
  const andar2=state.floorMode==='andar2';
  const r=svg.getBoundingClientRect();
  svg.setAttribute("viewBox",`0 0 ${r.width} ${r.height}`);
  svg.innerHTML="";
  const wTL=[(0-view.tx)/view.scale,(0-view.ty)/view.scale];
  const wBR=[(r.width-view.tx)/view.scale,(r.height-view.ty)/view.scale];
  const g=el("g");
  for(let x=Math.floor(wTL[0]/GRID)*GRID;x<=Math.ceil(wBR[0]/GRID)*GRID;x+=GRID){const sx=x*view.scale+view.tx;
    const mj=Math.abs(Math.round(x/5)*5-x)<1e-6;
    g.appendChild(el("line",{x1:sx,y1:0,x2:sx,y2:r.height,stroke:mj?"var(--grid-major)":"var(--grid)","stroke-width":1}));}
  for(let y=Math.floor(wTL[1]/GRID)*GRID;y<=Math.ceil(wBR[1]/GRID)*GRID;y+=GRID){const sy=y*view.scale+view.ty;
    const mj=Math.abs(Math.round(y/5)*5-y)<1e-6;
    g.appendChild(el("line",{x1:0,y1:sy,x2:r.width,y2:sy,stroke:mj?"var(--grid-major)":"var(--grid)","stroke-width":1}));}
  svg.appendChild(g);

  // ── Camadas de empilhamento (z-order) ────────────────────────────────
  // floor1Layer (painéis de piso do 1º andar) → wallLayer (paredes avulsas,
  // sempre do 1º andar) → floor2Layer (mezanino/escada, só existe/é usado no
  // modo 2º andar). Ordem de inserção no SVG = ordem de pintura — por isso
  // floor2Layer vem por ÚLTIMO: garante que mezanino/escada sempre apareçam
  // por CIMA das paredes do 1º andar (bug corrigido: antes as paredes avulsas
  // eram sempre desenhadas depois de TODOS os painéis, inclusive os do 2º
  // andar, então ficavam por cima deles mesmo no modo 2º andar).
  const floor1Layer=el("g"); svg.appendChild(floor1Layer);
  const wallLayer=el("g"); svg.appendChild(wallLayer);
  const floor2Layer=el("g"); svg.appendChild(floor2Layer);

  const esqTextSink=[], oitaoScreenBoxes=[];
  // Bounding boxes (tela) das cotas manuais — calculadas ANTES do
  // posicionamento dos textos de esquadria, para que o texto nunca pouse
  // em cima de uma cota (mesmo princípio usado para os oitões).
  const activeManualDims=(state.manualDims||[]).filter(d=>(d.andar||1)===(andar2?2:1));
  const manualDimScreenBoxes=activeManualDims.map(d=>{
    const p1=resolveDimPoint(d,'p1'), p2=resolveDimPoint(d,'p2');
    const{lineP1:q1,lineP2:q2,len}=dimAxisGeom(p1,p2,d.axis,d.linePos);
    const[sx1,sy1]=toScreen(q1[0],q1[1]);
    const[sx2,sy2]=toScreen(q2[0],q2[1]);
    const mx=(sx1+sx2)/2, my=(sy1+sy2)/2;
    const label=fmt(len)+" m";
    const w=tw_(label)+6;
    return{x1:mx-w/2-2, y1:my-11, x2:mx+w/2+2, y2:my+6};
  });
  let svgDefs=el("defs"); svg.appendChild(svgDefs);

  state.panels.forEach(p=>{
    const isF2=isFloor2Panel(p);
    // Abandonado o "bloco do 2º andar visto no 1º andar": fora do modo 2º
    // andar, mezanino/escada simplesmente não existem na tela — só
    // aparecem (na posição real) dentro do próprio modo 2º andar.
    if(!andar2 && isF2) return;
    const isSel=p.id===selId||selIds.has(p.id);
    const dimmed=andar2 && !isF2;
    const targetLayer=isF2?floor2Layer:floor1Layer;
    const parts=pisoParts(p);const grp=el("g",{"data-id":p.id,style:dimmed?"cursor:default;pointer-events:none;filter:brightness(.55)":"cursor:pointer"});


    parts.rects.forEach(rc=>{const[sx,sy]=toScreen(rc.x,rc.y);
      const a={x:sx,y:sy,width:rc.w*view.scale,height:rc.h*view.scale,fill:themedFill(rc.fill)};
      if(rc.floor){
        a.stroke=isSel?"var(--accent)":"#B7BEC6";
        a["stroke-width"]=isSel?2:1;a["vector-effect"]="non-scaling-stroke";
        if(!isSel)a["stroke-dasharray"]="4 3";}
      if(rc.isLamina){a.stroke="#5A626C";a["stroke-width"]=1;a["vector-effect"]="non-scaling-stroke";}
      if(rc.isEsq){a.stroke=ESQ_STROKE;a["stroke-width"]=1;a["vector-effect"]="non-scaling-stroke";}
      grp.appendChild(el("rect",a));});
    targetLayer.appendChild(grp);
    // Painel do 1º andar visto (escurecido) no modo 2º andar: mantém o
    // desenho das esquadrias (portas/janelas), mas sem o texto — ver pedido
    // "sumir os textos de esquadria do 1º andar no 2º andar". A geometria
    // (arco da porta etc.) continua aparecendo, só escurecida como o resto.
    const pathsForDraw = dimmed ? parts.paths.filter(pd=>pd.kind!=="text") : parts.paths;
    appendPaths(grp, pathsForDraw, esqTextSink);
    // ── Rede parametrizada: crosshatch sobre área cadastrada no tipo ──────
    const tyR=typeOf(p.typeId);
    if(tyR&&tyR.rede){
      const rd=tyR.rede;
      const r=rectOf(p);
      // Coordenadas locais (relativas ao canto inferior-esquerdo do piso)
      const wx0=r.x+rd.x0, wy0=r.y+(r.h-rd.y1), rW=rd.x1-rd.x0, rH=rd.y1-rd.y0;
      if(rW>0&&rH>0){
        const[sx,sy]=toScreen(wx0,wy0);
        const pw=rW*view.scale, ph=rH*view.scale;
        // Clip path para conter as linhas dentro do rect
        const clipId=`rede-clip-${p.id}`;
        const cp=el("clipPath",{id:clipId});
        cp.appendChild(el("rect",{x:sx,y:sy,width:pw,height:ph}));
        svgDefs.appendChild(cp);
        // Sem fundo — área totalmente vazada
        // Trama: linhas a cada ~10cm, cor escura para visibilidade
        const spacing=Math.max(3, 0.10*view.scale);
        const trama=el("g",{stroke:"rgba(0,0,0,0.50)","stroke-width":"0.8","vector-effect":"non-scaling-stroke","clip-path":`url(#${clipId})`});
        for(let y=sy;y<=sy+ph+spacing;y+=spacing)trama.appendChild(el("line",{x1:sx,y1:y,x2:sx+pw,y2:y}));
        for(let x=sx;x<=sx+pw+spacing;x+=spacing)trama.appendChild(el("line",{x1:x,y1:sy,x2:x,y2:sy+ph}));
        grp.appendChild(trama);
      }
    }
    // Oitão coletado em oitaoScreenBoxes aqui (para posicionamento de labels),
    // mas desenhado em 2ª passagem após todos os pisos/paredes (Fix 2).
    if(p.oitaoAtivo&&tyR&&tyR.possuiPossibilidadeOitao){
      let _owx, _owy;
      if(tyR.hwall){
        const _th=tyR.hwall.th, _dk=tyR.hwall.deck, _d=tyR.d, _W=tyR.w;
        const [_lxS,_lxE]=hwallLocalXRange(tyR.hwall,_W);
        const _midLx=(_lxS+_lxE)/2;
        const _ly0=_d/2-_dk-_th;
        const [_rx,_ry]=rotPoint(_midLx,_ly0,p.rot);
        _owx=p.cx+_rx; _owy=p.cy+_ry;
      } else {
        const _r=rectOf(p); const _wr=internalWallRect(p);
        _owx=_r.x+_r.w/2; _owy=_wr?_wr.y:_r.y;
      }
      const [ax,ay]=toScreen(_owx,_owy);
      const [onx,ony]=rotPoint(0,-1,p.rot);
      const aw=10, ah=10;
      const apx=ax+onx*ah, apy=ay+ony*ah;
      const _nw=tyR.nomeOitao?tyR.nomeOitao.length*5.5:0;
      oitaoScreenBoxes.push({
        x1:Math.min(ax,apx)-aw/2-6, y1:Math.min(ay,apy)-aw/2-6,
        x2:Math.max(ax,apx)+aw/2+_nw+6, y2:Math.max(ay,apy)+aw/2+(_nw>0?10:0)+6
      });
    }
    if(parts.name.show&&parts.name.text){const[nx,ny]=toScreen(parts.name.x,parts.name.y);
      const ng=el("g",{"data-name":p.id,style:dimmed?"cursor:default;pointer-events:none":"cursor:move"});
      const tw=Math.max(parts.name.text.length*7.5+16,30);
      ng.appendChild(el("rect",{x:nx-tw/2,y:ny-9,width:tw,height:18,fill:"transparent"}));
      const t=el("text",{x:nx,y:ny+4,class:"name-lbl","font-size":13});
      t.textContent=parts.name.text;ng.appendChild(t);targetLayer.appendChild(ng);}
  });

  state.wallInstances.forEach(inst=>{
    const isSel=inst.id===selId||selIds.has(inst.id);
    const dimmedWall=andar2; // paredes avulsas são sempre do 1º andar
    const parts=wallInstanceParts(inst);
    const grp=el("g",{"data-wall-inst":inst.id,style:dimmedWall?"cursor:default;pointer-events:none;filter:brightness(.55)":"cursor:pointer"});
    parts.polys.forEach(po=>{
      const pts=po.pts.map(([x,y])=>toScreen(x,y).join(",")).join(" ");
      grp.appendChild(el("polygon",{points:pts,fill:themedFill(po.fill),
        stroke:isSel?"var(--accent)":"none","stroke-width":isSel?2:0,"vector-effect":"non-scaling-stroke"}));
    });
    wallLayer.appendChild(grp);
    // Mesma regra das esquadrias de painel: parede avulsa (sempre 1º andar)
    // vista escurecida no modo 2º andar não mostra texto de esquadria.
    const wpathsForDraw = dimmedWall ? parts.paths.filter(pd=>pd.kind!=="text") : parts.paths;
    appendPaths(grp, wpathsForDraw, esqTextSink);
  });
  // Coleta bounding boxes dos oitãos de paredes avulsas para o mesmo mecanismo de evitação
  state.wallInstances.forEach(wi=>{
    if(!wi.oitaoAtivo) return;
    const wtO=wallTypeOf(wi.wallTypeId);
    if(!wtO||!wtO.possuiPossibilidadeOitao) return;
    const a=wallAABB(wi); if(!a) return;
    // Parede horizontal (a.w>=a.h): topo-centro. Vertical (a.h>a.w): face esquerda, meio da altura
    const isWide=a.w>=a.h;
    const [sx,sy]=isWide ? toScreen(a.x+a.w/2, a.y) : toScreen(a.x, a.y+a.h/2);
    const aw=10, ah=10;
    const _nw=wtO.nomeOitao?wtO.nomeOitao.length*5.5:0;
    oitaoScreenBoxes.push({
      x1:sx-aw/2-6, y1:sy-ah-(_nw>0?10:0)-6,
      x2:sx+aw/2+_nw+6, y2:sy+6
    });
  });
  drawEsqTexts(esqTextSink, [...oitaoScreenBoxes, ...manualDimScreenBoxes]);

  // ── Fix 2: 2ª passagem — oitões de painéis acima de tudo ──────────────
  state.panels.forEach(p=>{
    if(!p.oitaoAtivo) return;
    if(isFloor2Panel(p)!==andar2) return; // só oitão do andar sendo exibido agora
    const tyR=typeOf(p.typeId);
    if(!tyR||!tyR.possuiPossibilidadeOitao) return;
    let _owx, _owy;
    if(tyR.hwall){
      const _th=tyR.hwall.th, _dk=tyR.hwall.deck, _d=tyR.d, _W=tyR.w;
      const [_lxS,_lxE]=hwallLocalXRange(tyR.hwall,_W);
      const _midLx=(_lxS+_lxE)/2;
      const _ly0=_d/2-_dk-_th;
      const [_rx,_ry]=rotPoint(_midLx,_ly0,p.rot);
      _owx=p.cx+_rx; _owy=p.cy+_ry;
    } else {
      const _r=rectOf(p); const _wr=internalWallRect(p);
      _owx=_r.x+_r.w/2; _owy=_wr?_wr.y:_r.y;
    }
    const [ax,ay]=toScreen(_owx,_owy);
    const [onx,ony]=rotPoint(0,-1,p.rot);
    const aw=10, ah=10;
    const apx=ax+onx*ah, apy=ay+ony*ah;
    const arrow=el("polygon",{
      points:`${apx},${apy} ${ax-ony*aw/2},${ay+onx*aw/2} ${ax+ony*aw/2},${ay-onx*aw/2}`,
      fill:"#1f331b", stroke:"#fff", "stroke-width":"0.8",
      "vector-effect":"non-scaling-stroke", style:"pointer-events:none"
    });
    svg.appendChild(arrow);
    if(tyR.nomeOitao){
      const ot=el("text",{
        x:apx+(-ony)*6, y:apy+onx*6+3,
        fill:"#1f331b", stroke:"rgba(255,255,255,0.85)", "stroke-width":"3", "paint-order":"stroke fill",
        "font-family":"'Montserrat',sans-serif",
        "font-size":"9", "font-weight":"700",
        style:"pointer-events:none"
      });
      ot.textContent=tyR.nomeOitao;
      svg.appendChild(ot);
    }
  });

  state.labels.forEach(l=>{
    const lblSel=l.id===selId||selIds.has(l.id);
    const lines=(l.text||'').split('\n');
    const lineH=18;
    const[sx,sy]=toScreen(l.x,l.y);
    if(l.leaderAnchor){
      const[lax,lay]=toScreen(l.leaderAnchor.x,l.leaderAnchor.y);
      svg.appendChild(el('line',{x1:lax,y1:lay,x2:sx,y2:sy,
        stroke:lblSel?'var(--accent)':'#7A828C','stroke-width':1,'stroke-dasharray':'3 3',
        'vector-effect':'non-scaling-stroke',style:'pointer-events:none'}));
      svg.appendChild(el('circle',{cx:lax,cy:lay,r:3,
        fill:lblSel?'var(--accent)':'#7A828C',style:'pointer-events:none'}));
    }
    const lg=el('g',{'data-label':l.id,style:andar2?'cursor:default;pointer-events:none;filter:brightness(.55)':'cursor:pointer'});
    const maxLineLen=Math.max(...lines.map(ln=>ln.length));
    const tw=Math.max(maxLineLen*8+18,34);
    const th=lines.length*lineH+4;
    lg.appendChild(el('rect',{x:sx-tw/2,y:sy-lineH+2,width:tw,height:th,
      fill:lblSel?'var(--accent-soft)':'transparent',
      stroke:lblSel?'var(--accent)':'none','stroke-width':lblSel?1.5:0,
      'stroke-dasharray':lblSel?'4 2':'none',rx:5}));
    const t=el('text',{x:sx,y:sy,class:'room-lbl','font-size':15});
    if(lblSel)t.setAttribute('fill','var(--accent)');
    lines.forEach((ln,i)=>{
      const ts=el('tspan',{x:sx,dy:i===0?0:lineH});
      ts.textContent=ln;
      t.appendChild(ts);
    });
    lg.appendChild(t);svg.appendChild(lg);
  });

  activeManualDims.forEach(d=>{
    const sel=d.id===selId||selIds.has(d.id);
    const p1=resolveDimPoint(d,'p1'), p2=resolveDimPoint(d,'p2');
    const{lineP1:q1,lineP2:q2,len}=dimAxisGeom(p1,p2,d.axis,d.linePos);
    const[sx1,sy1]=toScreen(q1[0],q1[1]);
    const[sx2,sy2]=toScreen(q2[0],q2[1]);
    // extension/witness lines go from the actual measured point straight
    // across to the dimension line — horizontal if measuring Y, vertical if
    // measuring X, so the cota always reads as a pure axis distance.
    const[ex1,ey1]=toScreen(p1[0],p1[1]);
    const[ex2,ey2]=toScreen(p2[0],p2[1]);
    // Linhas da cota reagem ao tema (viram brancas no escuro); o texto e o
    // fundo do rótulo permanecem exatamente como no modo claro.
    const lineCol=sel?"var(--accent)":"var(--dim-line)";
    const textCol=sel?"var(--accent)":"#1C1F24";
    const g=el("g",{"data-dim":d.id,style:"cursor:pointer"});
    g.appendChild(el("line",{x1:sx1,y1:sy1,x2:sx2,y2:sy2,stroke:"transparent","stroke-width":14}));
    if(d.axis==="x"){
      g.appendChild(el("line",{x1:ex1,y1:ey1,x2:ex1,y2:sy1,stroke:lineCol,"stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
      g.appendChild(el("line",{x1:ex2,y1:ey2,x2:ex2,y2:sy2,stroke:lineCol,"stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
    } else {
      g.appendChild(el("line",{x1:ex1,y1:ey1,x2:sx1,y2:ey1,stroke:lineCol,"stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
      g.appendChild(el("line",{x1:ex2,y1:ey2,x2:sx2,y2:ey2,stroke:lineCol,"stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
    }
    g.appendChild(el("line",{x1:sx1,y1:sy1,x2:sx2,y2:sy2,stroke:lineCol,"stroke-width":sel?2:1.4,"vector-effect":"non-scaling-stroke"}));
    const tx=d.axis==="x"?0:5, ty=d.axis==="x"?5:0;
    g.appendChild(el("line",{x1:sx1-tx,y1:sy1-ty,x2:sx1+tx,y2:sy1+ty,stroke:lineCol,"stroke-width":1.2,"vector-effect":"non-scaling-stroke"}));
    g.appendChild(el("line",{x1:sx2-tx,y1:sy2-ty,x2:sx2+tx,y2:sy2+ty,stroke:lineCol,"stroke-width":1.2,"vector-effect":"non-scaling-stroke"}));
    const mx=(sx1+sx2)/2, my=(sy1+sy2)/2;
    const label=fmt(len)+" m";
    g.appendChild(el("rect",{x:mx-tw_(label)/2-3,y:my-10,width:tw_(label)+6,height:16,fill:"rgba(255,255,255,.85)",rx:3}));
    const t=el("text",{x:mx,y:my+4,"text-anchor":"middle","font-size":12,"font-weight":700,fill:textCol,"font-family":"Montserrat, sans-serif"});
    t.textContent=label;g.appendChild(t);
    svg.appendChild(g);
  });
  function tw_(s){return s.length*6.5;}
  if(tool==="dim"){
    if(dimDraftP1&&dimDraftP2){
      // step 2: the span is fixed — now the dimension line freely follows the
      // mouse along the locked axis until the 3rd click.
      const mousePt=dimMousePt||dimDraftP2;
      const axis=dimDraftAxis;
      const rawPos=axis==="x"?mousePt[1]:mousePt[0];
      const linePos=getSnappedLinePos(axis,rawPos,null);
      const{lineP1:q1,lineP2:q2,len}=dimAxisGeom(dimDraftP1,dimDraftP2,axis,linePos);
      const[sx1,sy1]=toScreen(q1[0],q1[1]);
      const[sx2,sy2]=toScreen(q2[0],q2[1]);
      const[ex1,ey1]=toScreen(dimDraftP1[0],dimDraftP1[1]);
      const[ex2,ey2]=toScreen(dimDraftP2[0],dimDraftP2[1]);
      if(axis==="x"){
        svg.appendChild(el("line",{x1:ex1,y1:ey1,x2:ex1,y2:sy1,stroke:"var(--accent)","stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
        svg.appendChild(el("line",{x1:ex2,y1:ey2,x2:ex2,y2:sy2,stroke:"var(--accent)","stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
      } else {
        svg.appendChild(el("line",{x1:ex1,y1:ey1,x2:sx1,y2:ey1,stroke:"var(--accent)","stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
        svg.appendChild(el("line",{x1:ex2,y1:ey2,x2:sx2,y2:ey2,stroke:"var(--accent)","stroke-width":1,"stroke-dasharray":"2 2","vector-effect":"non-scaling-stroke"}));
      }
      svg.appendChild(el("line",{x1:sx1,y1:sy1,x2:sx2,y2:sy2,stroke:"var(--accent)","stroke-width":1.8,"vector-effect":"non-scaling-stroke"}));
      const mx=(sx1+sx2)/2, my=(sy1+sy2)/2;
      const label=fmt(len)+" m";
      svg.appendChild(el("rect",{x:mx-tw_(label)/2-3,y:my-10,width:tw_(label)+6,height:16,fill:"rgba(255,255,255,.92)",rx:3}));
      const t=el("text",{x:mx,y:my+4,"text-anchor":"middle","font-size":12,"font-weight":700,fill:"var(--accent)","font-family":"Montserrat, sans-serif"});
      t.textContent=label;svg.appendChild(t);
      svg.appendChild(el("circle",{cx:ex1,cy:ey1,r:4,fill:"var(--accent)"}));
      svg.appendChild(el("circle",{cx:ex2,cy:ey2,r:4,fill:"var(--accent)"}));
    } else if(dimDraftP1){
      const[sx1,sy1]=toScreen(dimDraftP1[0],dimDraftP1[1]);
      const hov=dimHoverPt||dimDraftP1;
      const[sx2,sy2]=toScreen(hov[0],hov[1]);
      svg.appendChild(el("line",{x1:sx1,y1:sy1,x2:sx2,y2:sy2,stroke:"var(--accent)","stroke-width":1.5,"stroke-dasharray":"4 3","vector-effect":"non-scaling-stroke"}));
      svg.appendChild(el("circle",{cx:sx1,cy:sy1,r:4,fill:"var(--accent)"}));
      if(dimHoverPt){const[hx,hy]=toScreen(dimHoverPt[0],dimHoverPt[1]);
        svg.appendChild(el("circle",{cx:hx,cy:hy,r:5,fill:"none",stroke:"var(--accent)","stroke-width":2}));}
    } else if(dimHoverPt){
      const[hx,hy]=toScreen(dimHoverPt[0],dimHoverPt[1]);
      svg.appendChild(el("circle",{cx:hx,cy:hy,r:5,fill:"none",stroke:"var(--accent)","stroke-width":2}));
    }
  }

  if(tool==="place"&&armedType&&ghostPos){const ty=typeOf(armedType);
    const w=(ghostRot%180===0?ty.w:ty.d),h=(ghostRot%180===0?ty.d:ty.w);
    const[sx,sy]=toScreen(ghostPos[0]-w/2,ghostPos[1]-h/2);
    svg.appendChild(el("rect",{x:sx,y:sy,width:w*view.scale,height:h*view.scale,
      fill:ty.color,"fill-opacity":.3,stroke:"var(--accent)","stroke-width":1.5,"stroke-dasharray":"4 3"}));}
  if(tool==="placewall"&&armedWallType&&ghostPos){
    const ghostInst={wallTypeId:armedWallType,ax:ghostPos[0],ay:ghostPos[1],rot:ghostRot};
    const parts=wallInstanceParts(ghostInst);
    const ghostBad=wallGhostOnLamina(ghostInst)||wallOverlapsAny(ghostInst,null)||!!wallPisoCompatError(ghostInst);
    const ghostClr=ghostBad?"#D6336C":"var(--accent)";
    parts.polys.forEach(po=>{
      const pts=po.pts.map(([x,y])=>toScreen(x,y).join(",")).join(" ");
      svg.appendChild(el("polygon",{points:pts,fill:ghostClr,"fill-opacity":.35,stroke:ghostClr,"stroke-width":1.5,"stroke-dasharray":"4 3"}));
    });
  }
  // Rubber-band selection box
  if(drag && drag.kind==="rubberband" && drag.hasMoved){
    const rb=rectFromRubberband(drag);
    const[sx,sy]=toScreen(rb.x,rb.y);
    svg.appendChild(el("rect",{x:sx,y:sy,
      width:rb.w*view.scale,height:rb.h*view.scale,
      fill:"rgba(100,160,255,0.10)",
      stroke:"#64A0FF","stroke-width":1.5,
      "stroke-dasharray":"5 3",
      "vector-effect":"non-scaling-stroke",
      style:"pointer-events:none"}));
  }
  // ── Oitão em wallInstances ────────────────────────────────────────────
  state.wallInstances.forEach(wi=>{
    if(!wi.oitaoAtivo) return;
    if(andar2) return; // paredes avulsas são sempre do 1º andar
    const wtO=wallTypeOf(wi.wallTypeId);
    if(!wtO||!wtO.possuiPossibilidadeOitao) return;
    const a=wallAABB(wi); if(!a) return;
    // Horizontal (a.w>=a.h): topo-centro. Vertical (a.h>a.w): face esquerda, meio da altura
    const isWide=a.w>=a.h;
    const [sx,sy]=isWide ? toScreen(a.x+a.w/2,a.y) : toScreen(a.x, a.y+a.h/2);
    const aw=10,ah=10;
    const arrowW=el("polygon",{
      points:`${sx},${sy-ah} ${sx-aw/2},${sy} ${sx+aw/2},${sy}`,
      fill:"#1f331b", stroke:"#fff","stroke-width":"0.8",
      "vector-effect":"non-scaling-stroke",style:"pointer-events:none"
    });
    svg.appendChild(arrowW);
    if(wtO.nomeOitao){
      // Texto à esquerda (text-anchor="end") para paredes verticais, à direita para horizontais
      const otW=el("text",{
        x: isWide ? sx+aw/2+4 : sx-aw/2-4,
        y: sy-3, fill:"#1f331b",
        "text-anchor": isWide ? "start" : "end",
        stroke:"rgba(255,255,255,0.85)","stroke-width":"3","paint-order":"stroke fill",
        "font-family":"'Montserrat',sans-serif","font-size":"9","font-weight":"700",
        style:"pointer-events:none"
      });
      otW.textContent=wtO.nomeOitao;
      svg.appendChild(otW);
    }
  });
  updateHud();
}
function updateHud(){
  document.getElementById("zVal").textContent=Math.round(view.scale/46*100)+"%";
  const bb=contentBBox();
  document.getElementById("footprint").innerHTML=
    `<b>${fmt(bb.w)} × ${fmt(bb.h)}</b> m<br><span class="a">${fmt(occupiedArea())} m²</span>`;
  renderSelbar();
}

function renderSelbar(){
  const bar=document.getElementById("selbar");
  // Multi-seleção: mostrar barra especial se houver mais de 1 item selecionado
  if(selIds.size > 1){
    bar.classList.add("show");
    bar.innerHTML=`<span class="lab">selecionados</span>
      <span class="lab" data-planta-style="planta-inline-001">${selIds.size} itens</span>
      <span class="sep"></span>
      <button id="multiDup">⧉ Duplicar todos</button>
      <button class="del" id="multiDel">🗑 Excluir todos</button>`;
    bar.querySelector("#multiDup").onclick=dupSel;
    bar.querySelector("#multiDel").onclick=delSel;
    return;
  }
  const p=state.panels.find(p=>p.id===selId);
  const wi=(!p)?state.wallInstances.find(s=>s.id===selId):null;
  const lb=(!p&&!wi)?state.labels.find(l=>l.id===selId):null;
  const dm=(!p&&!wi&&!lb)?state.manualDims.find(d=>d.id===selId):null;
  if(!p&&!wi&&!lb&&!dm){bar.classList.remove("show");bar.innerHTML="";return;}
  if(dm){
    const len=Math.hypot(dm.p2[0]-dm.p1[0],dm.p2[1]-dm.p1[1]);
    bar.classList.add("show");
    bar.innerHTML=`<span class="lab">cota</span>
      <span class="lab" data-planta-style="planta-inline-001">${fmt(len)} m</span>
      <span class="sep"></span>
      <button class="del" id="dDel">🗑 Excluir</button>`;
    bar.querySelector("#dDel").onclick=delSel;
    return;
  }
  if(lb){
    bar.classList.add("show");
    const hasAnchor=!!(lb.leaderAnchor);
    bar.innerHTML=`<span class="lab">rótulo</span>
      <span class="lab" data-planta-style="planta-inline-002">${esc((lb.text||'').split('\n')[0])}</span>
      <span class="sep"></span>
      <button id="lRen">✎ Editar texto</button>
      <button id="lAnchor" class="${hasAnchor?'on':''}">${hasAnchor?'📍 Remover âncora':'📍 Definir âncora'}</button>
      <button class="del" id="lDel">🗑 Excluir</button>`;
    bar.querySelector("#lRen").onclick=renameLabel;
    bar.querySelector("#lDel").onclick=delSel;
    bar.querySelector("#lAnchor").onclick=()=>{
      if(lb.leaderAnchor){
        // Remove âncora
        saveState(); lb.leaderAnchor=null; render(); renderSelbar();
      } else {
        // Ativa modo de definição de âncora
        setLeaderAnchorMode=lb.id;
        toast('📍 Clique no canvas para definir o ponto de âncora da linha de chamada.');
      }
    };
    return;
  }
  if(wi){
    const wt=wallTypeOf(wi.wallTypeId);
    bar.classList.add("show");
    const len=wt?wallTypeLength(wt):0;
    const _doors=(wt&&wt.doors&&wt.doors.length)?wt.doors:(wt&&wt.door?[wt.door]:[]);
    const hasDoorFlex=!!(_doors.length>0&&wt&&wt.doorFlexible);
    const _firstDoor=_doors[0]||null;
    const curOpens=wi.doorOpens||(_firstDoor&&_firstDoor.opens)||"fora";
    const curHinge=wi.doorHinge||(_firstDoor&&_firstDoor.hinge)||"esquerda";
    const doorPart=hasDoorFlex?`
      <span class="sep"></span>
      <span class="lab">abre</span>
      <button id="wOpDentro" class="${curOpens==="dentro"?"on":""}">Dentro</button>
      <button id="wOpFora" class="${curOpens==="fora"?"on":""}">Fora</button>
      <span class="sep"></span>
      <span class="lab">dobradiça</span>
      <button id="wHgEsq" class="${curHinge==="esquerda"?"on":""}">◁ Esq</button>
      <button id="wHgDir" class="${curHinge==="direita"?"on":""}">▷ Dir</button>`:"";
    bar.innerHTML=`<span class="lab">parede</span>
      <span class="lab" data-planta-style="planta-inline-001">${esc(wt?wt.name:"?")} · ${fmt(len)} m</span>
      <span class="sep"></span>
      <button id="wRotate">↻ Girar</button>
      <button id="wDup">⧉ Duplicar</button>
      <button class="del" id="wDel">🗑 Excluir</button>${doorPart}`;
    bar.querySelector("#wRotate").onclick=rotateSel;
    bar.querySelector("#wDup").onclick=dupSel;
    bar.querySelector("#wDel").onclick=delSel;
    if(hasDoorFlex){
      const setDoor=(opens,hinge)=>{saveState();wi.doorOpens=opens;wi.doorHinge=hinge;render();};
      bar.querySelector("#wOpDentro").onclick=()=>setDoor("dentro",curHinge);
      bar.querySelector("#wOpFora").onclick=()=>setDoor("fora",curHinge);
      bar.querySelector("#wHgEsq").onclick=()=>setDoor(curOpens,"esquerda");
      bar.querySelector("#wHgDir").onclick=()=>setDoor(curOpens,"direita");
    }
    // Oitão para parede
    if(wt&&wt.possuiPossibilidadeOitao){
      const oSep=document.createElement("span");oSep.className="sep";bar.appendChild(oSep);
      const oLab=document.createElement("span");oLab.className="lab";oLab.textContent="oitão";bar.appendChild(oLab);
      const oBtn=document.createElement("button");
      oBtn.className=wi.oitaoAtivo?"on":"";
      oBtn.textContent=wi.oitaoAtivo?"▲ Ativado":"△ Ativar";
      oBtn.onclick=()=>{saveState();wi.oitaoAtivo=!wi.oitaoAtivo;render();renderSelbar();};
      bar.appendChild(oBtn);
    }
    return;
  }
  if(!p){bar.classList.remove("show");bar.innerHTML="";return;}
  bar.classList.add("show");
  const w=p.walls||{l:"solid",r:"solid"},c=p.corners||{},nm=p.name||{};
  const pty=typeOf(p.typeId);
  const wallsLocked=!!(pty&&pty.lockWalls);
  
  const wl = (!w.l || w.l === 'none');
  const wr = (!w.r || w.r === 'none');
  const isStairPanel = !!(pty && pty.isStair);

  const wallsCornersHtml = isStairPanel ? '' : `
    <span class="sep"></span>
    <span class="lab">paredes${wallsLocked?' 🔒':''}</span>
    <button class="cstate" data-side="l" ${wallsLocked?'disabled title="Paredes laterais bloqueadas para este modelo"':''}>Esq: ${WLAB[w.l||'none']}</button>
    <button class="cstate" data-side="r" ${wallsLocked?'disabled title="Paredes laterais bloqueadas para este modelo"':''}>Dir: ${WLAB[w.r||'none']}</button>
    <span class="sep"></span>
    <span class="lab">cantos 14cm</span>
    <button class="corner ${c.tl?'on':''}" data-c="tl" title="superior esquerdo" ${wl?'':'disabled'}>◰</button>
    <button class="corner ${c.tr?'on':''}" data-c="tr" title="superior direito" ${wr?'':'disabled'}>◳</button>
    <button class="corner ${c.bl?'on':''}" data-c="bl" title="inferior esquerdo" ${wl?'':'disabled'}>◱</button>
    <button class="corner ${c.br?'on':''}" data-c="br" title="inferior direito" ${wr?'':'disabled'}>◲</button>`;

  bar.innerHTML=`<span class="lab">nome</span>
    <button id="nShow" class="${nm.show!==false?'on':''}">${nm.show!==false?'visível':'oculto'}</button>
    <button id="nRen">renomear</button>
    ${wallsCornersHtml}
    <span class="sep"></span>
    <button id="sRotate">↻ Girar</button>
    <button id="sDup">⧉ Duplicar</button>
    <button class="del" id="sDel">🗑 Excluir</button>`;
  
  bar.querySelector("#nShow").onclick=()=>{saveState(); p.name=p.name||{};p.name.show=!(p.name.show!==false);render();};
  bar.querySelector("#nRen").onclick=()=>renameSel();
  
  if(!isStairPanel && !wallsLocked)bar.querySelectorAll("[data-side]").forEach(b=>b.onclick=()=>{
    saveState();
    p.walls=p.walls||{};
    const k=b.dataset.side;p.walls[k]=WALLCYCLE[(WALLCYCLE.indexOf(p.walls[k]||"none")+1)%3];
    if(p.walls.l !== 'none') { p.corners.tl = false; p.corners.bl = false; }
    if(p.walls.r !== 'none') { p.corners.tr = false; p.corners.br = false; }
    render();});
    
  bar.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
    saveState();
    p.corners=p.corners||{};
    const isL = (b.dataset.c === 'tl' || b.dataset.c === 'bl');
    if (isL && !wl) return; 
    const isR = (b.dataset.c === 'tr' || b.dataset.c === 'br');
    if (isR && !wr) return;
    p.corners[b.dataset.c]=!p.corners[b.dataset.c];
    render();});
    
  bar.querySelector("#sRotate").onclick=rotateSel;
  bar.querySelector("#sDup").onclick=dupSel;
  bar.querySelector("#sDel").onclick=delSel;

  // ── Esquadrias do hwall (replicando lógica das paredes) ────────────────
  const hEsqs=(pty&&pty.hwall&&pty.hwall.esquadrias)||[];
  if(hEsqs.length>0){
    const esqSpan=document.createElement("span");
    esqSpan.className="lab";
    esqSpan.style.cssText="margin-left:4px;color:rgba(255,255,255,.5);font-size:10.5px";
    esqSpan.textContent="esq.: "+hEsqs.map(e=>e.name||e.type||"—").join(" · ");
    bar.appendChild(esqSpan);
  }

  // ── Oitão: toggle se o tipo possui essa possibilidade ─────────────────
  if(pty&&pty.possuiPossibilidadeOitao){
    const sep=document.createElement("span");sep.className="sep";bar.appendChild(sep);
    const oLab=document.createElement("span");oLab.className="lab";oLab.textContent="oitão";bar.appendChild(oLab);
    const oBtn=document.createElement("button");
    oBtn.id="oitaoToggle";
    oBtn.className=p.oitaoAtivo?"on":"";
    oBtn.textContent=p.oitaoAtivo?"▲ Ativado":"△ Ativar";
    oBtn.onclick=()=>{saveState();p.oitaoAtivo=!p.oitaoAtivo;render();renderSelbar();};
    bar.appendChild(oBtn);
  }

  // ── Escada: comprimento do patamar, editável por instância no canvas ───
  // (o valor cadastrado no tipo funciona como padrão inicial ao posicionar)
  if(pty&&pty.isStair&&pty.patamar){
    const sep2=document.createElement("span");sep2.className="sep";bar.appendChild(sep2);
    const sLab=document.createElement("span");sLab.className="lab";sLab.textContent="patamar (m)";bar.appendChild(sLab);
    const sInp=document.createElement("input");
    sInp.type="number";sInp.step="0.05";sInp.min="0.3";
    sInp.value=(p.patamarLen!=null?p.patamarLen:(pty.patamarComprimento||0.9)).toFixed(2);
    sInp.style.cssText="width:62px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:6px;color:#fff;font-size:12px;padding:5px 6px;font-family:var(--mono)";
    sInp.onchange=()=>{
      const v=Math.max(0.3, parseFloat(sInp.value)||pty.patamarComprimento||0.9);
      saveState(); p.patamarLen=v; render(); renderSelbar();
    };
    bar.appendChild(sInp);
  }
}

function renameSel(){const p=state.panels.find(p=>p.id===selId);if(!p)return;
  p.name=p.name||{text:"",dx:0,dy:0,show:true};
  const d=dims(p),orig={text:p.name.text||"",dx:p.name.dx||0,dy:p.name.dy||0};
  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML=`<h3>Nome do piso</h3>
    <div class="field"><label>Texto</label><input id="r_in" value="${esc(p.name.text||"")}"></div>
    <div class="field"><label>Posição do nome</label>
      <div class="swatches" id="r_pos" data-planta-style="planta-inline-003">
        ${["Centro","Acima","Abaixo","Esquerda","Direita"].map(o=>`<button type="button" class="tbtn" data-pos="${o}">${o}</button>`).join("")}</div>
      <p class="sub" data-planta-style="planta-inline-004">Você também pode arrastar o nome direto na planta. Ele sempre ficará contido dentro do piso.</p></div>
    <div class="modal-actions"><button class="tbtn" id="r_cancel">Cancelar</button><button class="tbtn primary" id="r_ok">Confirmar</button></div>`;
  const setPos=o=>{const h=d.h/2,w=d.w/2;
    p.name.dx=o==="Esquerda"?-(w-0.4):o==="Direita"?(w-0.4):0;
    p.name.dy=o==="Acima"?-(h-0.4):o==="Abaixo"?(h-0.4):0;render();};
  modalBody.querySelectorAll("[data-pos]").forEach(b=>b.onclick=()=>{saveState(); setPos(b.dataset.pos);});
  document.getElementById("r_cancel").onclick=()=>{p.name.text=orig.text;p.name.dx=orig.dx;p.name.dy=orig.dy;closeModal();render();};
  document.getElementById("r_ok").onclick=()=>{saveState(); p.name.text=document.getElementById("r_in").value.trim();p.name.show=true;closeModal();render();};
  scrim.classList.add("show");setTimeout(()=>{const i=document.getElementById("r_in");i.focus();i.select();},50);
}

function renameLabel(){
  const l=state.labels.find(l=>l.id===selId);if(!l)return;
  const orig=l.text;
  openTextModal("Editar rótulo de ambiente",l.text,txt=>{
    if(txt===null)return; 
    saveState();
    l.text=(txt||"").trim()||orig;
    render();
  },true);
}

let editingWallType=null;
let wtDoors=[]; // dynamic door list for the wall type modal
function renderWtDoors(){
  const L=parseFloat(document.getElementById("wt_len").value)||2.00;
  const list=document.getElementById("wt_doors_list");
  if(!list)return;
  const WT_TIPOS={porta_giro:"🚪 Giro",porta_correr_1:"↔ Correr 1",abertura:"▭ Abertura"};
  list.innerHTML=wtDoors.map((d,i)=>`
    <div data-planta-style="planta-inline-005">
      <div data-planta-style="planta-inline-006">
        <b data-planta-style="planta-inline-007">Abertura ${i+1}</b>
        <button type="button" class="mini" data-rm="${i}">✕ Remover</button>
      </div>
      <div data-planta-style="planta-inline-008">
        ${Object.entries(WT_TIPOS).map(([t,lbl])=>`<button type="button" class="tbtn wd_tp${(d.tipo||'porta_giro')===t?' primary':''}" data-i="${i}" data-tp="${t}" data-planta-style="planta-inline-009">${lbl}</button>`).join('')}
      </div>
      <div class="field" data-planta-style="planta-inline-010">
        <label>Nome na planta</label>
        <div data-planta-style="planta-inline-011">
          <input class="wd_name" data-i="${i}" data-planta-style="planta-inline-012" placeholder="P1, PORTA..." value="${d.name||''}">
          <button type="button" class="mini wd_shn" data-i="${i}" title="Visível/oculto" data-planta-style="planta-inline-013">${d.showName!==false?'👁 visível':'🚫 oculto'}</button>
        </div>
      </div>
      <div class="two">
        <div class="field" data-planta-style="planta-inline-010"><label>Posição (m)</label><input class="wd_at" data-i="${i}" type="number" step="0.01" value="${(d.at||0).toFixed(2)}"></div>
        <div class="field" data-planta-style="planta-inline-010"><label>Largura (m)</label><input class="wd_w" data-i="${i}" type="number" step="0.01" value="${(d.w||0.8).toFixed(2)}"></div>
      </div>
      ${(d.tipo||'porta_giro')==='porta_giro'?`
      <div class="two">
        <div class="field" data-planta-style="planta-inline-010"><label>Abre para</label>
          <div data-planta-style="planta-inline-014">
            <button type="button" class="tbtn wd_op" data-i="${i}" data-v="dentro" data-planta-style="planta-door-button" data-planta-door-active="${d.opens==='dentro' ? 'yes' : 'no'}">Dentro</button>
            <button type="button" class="tbtn wd_op" data-i="${i}" data-v="fora" data-planta-style="planta-door-button" data-planta-door-active="${d.opens!=='dentro' ? 'yes' : 'no'}">Fora</button>
          </div></div>
        <div class="field" data-planta-style="planta-inline-010"><label>Dobradiça</label>
          <div data-planta-style="planta-inline-014">
            <button type="button" class="tbtn wd_hg" data-i="${i}" data-v="esquerda" data-planta-style="planta-door-button" data-planta-door-active="${(d.hinge==='esquerda'||!d.hinge) ? 'yes' : 'no'}">Esq</button>
            <button type="button" class="tbtn wd_hg" data-i="${i}" data-v="direita" data-planta-style="planta-door-button" data-planta-door-active="${d.hinge==='direita' ? 'yes' : 'no'}">Dir</button>
          </div></div>
      </div>`:''}
    </div>`).join('');
  list.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{wtDoors.splice(+b.dataset.rm,1);renderWtDoors();});
  list.querySelectorAll('.wd_shn').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;wtDoors[i].showName=!(wtDoors[i].showName!==false);renderWtDoors();});
  list.querySelectorAll('.wd_op').forEach(b=>b.onclick=()=>{wtDoors[+b.dataset.i].opens=b.dataset.v;renderWtDoors();});
  list.querySelectorAll('.wd_hg').forEach(b=>b.onclick=()=>{wtDoors[+b.dataset.i].hinge=b.dataset.v;renderWtDoors();});
  list.querySelectorAll('.wd_tp').forEach(b=>b.onclick=()=>{wtDoors[+b.dataset.i].tipo=b.dataset.tp;renderWtDoors();});
  list.querySelectorAll('.wd_name').forEach(i=>i.oninput=()=>{wtDoors[+i.dataset.i].name=i.value;});
  list.querySelectorAll('.wd_at,.wd_w').forEach(i=>i.oninput=()=>{wtDoors[+i.dataset.i][i.classList.contains('wd_at')?'at':'w']=parseFloat(i.value)||0;});
  document.getElementById("wt_flex_row").style.display=wtDoors.length>0?'':'none';
}

// ════════════════════════════════════════════════════════════════════════
// MODELO 3D — seção reaproveitada nos editores de Piso/Mezanino e de Parede.
// Guarda model3d.parts: uma lista de peças (.glb), cada uma marcada com um
// "papel" pré-definido (Base, Lateral esquerda sólida, Canto, Oitão etc.).
// Em vez de depender do usuário renomear objetos dentro do arquivo 3D (nome
// técnico tipo "OPT_lateral_L_solid"), a pessoa escolhe o papel num <select>
// aqui no formulário — o app decide sozinho quais peças juntar na cena
// conforme o estado do painel (panel.walls, panel.corners, panel.oitaoAtivo).
// Sem nenhuma peça cadastrada, a aba 3D usa a caixa placeholder colorida
// (ver rebuildScene3D/placeholderMesh no bloco "VISUALIZAÇÃO 3D" no fim do
// arquivo). Isso não mexe em nada do 2D nem em state.tabs/activeTab.
// ════════════════════════════════════════════════════════════════════════

// Papéis pré-definidos que uma peça de modelo 3D pode assumir. "base" é
// sempre carregada; as demais só entram na cena quando a instância do
// painel tiver a condição correspondente ativa.
const MODEL3D_ROLES=[
  {value:'base',              label:'Base (sempre visível)'},
  {value:'lateral_l_solida',  label:'Lateral esquerda — sólida'},
  {value:'lateral_l_porta',   label:'Lateral esquerda — porta/janela'},
  {value:'lateral_r_solida',  label:'Lateral direita — sólida'},
  {value:'lateral_r_porta',   label:'Lateral direita — porta/janela'},
  {value:'canto_tl',          label:'Canto superior esquerdo'},
  {value:'canto_tr',          label:'Canto superior direito'},
  {value:'canto_bl',          label:'Canto inferior esquerdo'},
  {value:'canto_br',          label:'Canto inferior direito'},
  {value:'oitao',             label:'Oitão (janela)'},
  // Variações de porta para paredes com "abre: Dentro/Fora" + "dobradiça:
  // Esquerda/Direita" (ver hasDoorFlex/doorOpens/doorHinge). Como são dois
  // eixos independentes, o cadastro precisa das 4 combinações pra escolher
  // o .glb certo pra cada uma.
  {value:'porta_dentro_esquerda', label:'Porta — Dentro + Esquerda'},
  {value:'porta_dentro_direita',  label:'Porta — Dentro + Direita'},
  {value:'porta_fora_esquerda',   label:'Porta — Fora + Esquerda'},
  {value:'porta_fora_direita',    label:'Porta — Fora + Direita'}
];
function model3dRoleLabel(value){
  const r=MODEL3D_ROLES.find(r=>r.value===value);
  return r?r.label:value;
}

function renderModel3DSectionHTML(prefix, t){
  return `
    <details class="tm-section" id="${prefix}_3d_section">
      <summary><span class="bom-title" data-planta-style="planta-inline-015">🧊 Modelo 3D
        <span data-planta-style="planta-inline-016" data-planta-stop-propagation="true">
          <button type="button" class="tbtn" id="${prefix}_3d_copy" data-planta-style="planta-inline-017" title="Copiar peças do modelo 3D">📋 Copiar</button>
          <button type="button" class="tbtn" id="${prefix}_3d_paste" data-planta-style="planta-inline-017" title="Colar peças copiadas">📌 Colar</button>
        </span>
      </span></summary>
      <div class="tm-body">
        <div class="field" data-planta-style="planta-inline-018">
          <label>Peças do modelo (.glb)</label>
          <div id="${prefix}_3d_list"></div>
          <button type="button" class="tbtn" id="${prefix}_3d_add" data-planta-style="planta-inline-019">+ Adicionar peça</button>
        </div>
      </div>
    </details>`;
}

// Converte links "de navegador" pra links diretos que os loaders conseguem
// buscar via fetch/XHR (com CORS liberado):
//  - Google Drive: .../file/d/ID/view, open?id=ID, uc?id=ID -> uc?export=download&id=ID
//    (funciona pra navegar/baixar, mas o Drive não manda cabeçalho CORS nesse
//    endpoint — então pode falhar quando carregado por código, mesmo assim.
//    Ver aviso no "Testar".)
//  - GitHub: link normal de "ver arquivo" (github.com/user/repo/blob/branch/caminho)
//    -> raw.githubusercontent.com/user/repo/branch/caminho, que TEM CORS
//    liberado (Access-Control-Allow-Origin: *) e é a alternativa recomendada
//    quando o Drive não funciona. Repositório precisa ser público.
// Se não reconhecer o link, devolve a URL original sem mexer.
// ── Qualidade do modelo 3D (Leve/Detalhado) ─────────────────────────────
// Preferência de sessão (não é salva no projeto) — perguntada toda vez que
// o usuário abre a aba 3D (ver promptModelQuality3D). 'detalhado' usa os
// .glb tal como cadastrados (pasta "4k Textures"); 'leve' troca essa pasta
// por "Flat Textures" no momento de carregar/exibir, sem alterar o cadastro.
// IMPORTANTE (pedido explícito): a renderização (exposição, luz, tone
// mapping etc.) deve ser EXATAMENTE igual pras duas qualidades — a única
// diferença entre elas é qual pasta de textura é usada no link do .glb (ver
// qualityAdjustUrl). Já existiu aqui uma tentativa de compensar o Leve
// parecendo mais claro ajustando a exposição por qualidade; foi revertida
// porque não resolveu e o pedido agora é rendering idêntico.
let render3DQuality='detalhado';
function qualityAdjustUrl(url){
  if(!url) return url;
  if(render3DQuality!=='leve') return url;
  return url.replace(/4k(%20|\s)Textures/gi, (m,sep)=>`Flat${sep}Textures`);
}
// Normaliza (Drive/GitHub) e já aplica a troca de pasta conforme a
// qualidade escolhida — usar SEMPRE este (e não normalizeAssetUrl puro) nos
// pontos que efetivamente carregam/cacheiam o .glb pra exibir na cena 3D,
// senão a chave do cache (a própria URL) fica inconsistente entre o preload
// (collectDistinctModelUrls) e o momento de montar o node (buildInstanceNode3D).
function resolvedModelUrl(url){ return qualityAdjustUrl(normalizeAssetUrl(url)); }
function normalizeAssetUrl(url){
  if(!url) return url;
  const clean=url.trim();
  if(/drive\.google\.com/i.test(clean)){
    let id=null;
    let m=clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if(m) id=m[1];
    if(!id){ m=clean.match(/[?&]id=([a-zA-Z0-9_-]+)/); if(m) id=m[1]; }
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : clean;
  }
  if(/^https?:\/\/github\.com\//i.test(clean)){
    const m=clean.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/i);
    if(m){
      const [, user, repo, branch, path] = m;
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
    }
    return clean;
  }
  return clean;
}

// Tenta carregar um .glb sem tocar no cache/estado usado pela cena real —
// só serve pra dar feedback de "esse link funciona" no editor de tipos.
// Devolve {ok, message} em vez de só true/false: um erro de rede/CORS chega
// aqui como TypeError ("Failed to fetch"), e um erro de parsing (arquivo
// corrompido, glTF separado sem os .bin/texturas, Draco sem decoder, etc.)
// chega com uma mensagem própria — sem isso, os dois pareciam a mesma falha
// genérica pra quem está tentando diagnosticar.
function testGlbUrl(url){
  return new Promise(resolve=>{
    try{
      const loader=(typeof ensureLoader3D==="function")?ensureLoader3D():new THREE.GLTFLoader();
      loader.load(
        url,
        ()=>resolve({ok:true}),
        undefined,
        err=>{
          console.error('[Modelo 3D] Falha ao carregar', url, err);
          const message=(err&&(err.message||err.target?.statusText))||String(err);
          resolve({ok:false, message});
        }
      );
    }catch(e){
      console.error('[Modelo 3D] Exceção ao testar', url, e);
      resolve({ok:false, message:(e&&e.message)||String(e)});
    }
  });
}

// Chamar depois de injetar o HTML de renderModel3DSectionHTML no DOM.
// Retorna { getModel3D() } para ler o valor atual ao salvar — um objeto
// { parts: [{id, role, label, url}] } ou null se não houver nenhuma peça.
function wireModel3DSection(prefix, t){
  // Migração automática do formato antigo (model3d.variants / model3d.url,
  // sem "papel" nenhum) para o novo (model3d.parts, com role): entradas
  // antigas viram peças com role "base", já que era isso que representavam
  // antes de existir a noção de peça opcional por papel.
  const legacyVariants=(t.model3d && Array.isArray(t.model3d.variants)) ? t.model3d.variants : null;
  const initial = (t.model3d && Array.isArray(t.model3d.parts) && t.model3d.parts.length)
    ? JSON.parse(JSON.stringify(t.model3d.parts))
    : (legacyVariants && legacyVariants.length
        ? legacyVariants.map(v=>({id:v.id||uid(), role:'base', label:v.label||'', url:v.url||''}))
        : (t.model3d && t.model3d.url ? [{id:uid(), role:'base', label:'', url:t.model3d.url}] : []));
  let rows = initial;
  const listEl = document.getElementById(prefix+'_3d_list');

  function paint(){
    listEl.innerHTML='';
    rows.forEach((v,i)=>{
      if(!v.role) v.role='base';
      const row=document.createElement('div');
      row.className='v3d-row';
      row.innerHTML=`
        <select class="v3d-role">${MODEL3D_ROLES.map(r=>`<option value="${r.value}">${r.label}</option>`).join('')}</select>
        <input class="v3d-label" placeholder="Nome (opcional, ex: Pintado branco)">
        <input class="v3d-url" placeholder="Link do GitHub (ou Drive)">
        <button type="button" class="v3d-test">Testar</button>
        <button type="button" class="v3d-del" title="Remover">✕</button>`;
      row.querySelector('.v3d-role').value=v.role;
      row.querySelector('.v3d-label').value=v.label||'';
      row.querySelector('.v3d-url').value=v.url||'';
      row.querySelector('.v3d-role').onchange=e=>{rows[i].role=e.target.value;};
      row.querySelector('.v3d-label').oninput=e=>{rows[i].label=e.target.value;};

      const urlInput=row.querySelector('.v3d-url');
      urlInput.oninput=e=>{rows[i].url=e.target.value.trim();};
      // Ao sair do campo, já converte link do Drive/GitHub pro formato direto
      // e mostra o resultado — assim o usuário vê que a conversão rolou antes
      // mesmo de clicar em Testar.
      urlInput.onblur=()=>{
        const raw=(rows[i].url||'').trim();
        if(!raw) return;
        const direct=normalizeAssetUrl(raw);
        if(direct!==raw){
          rows[i].url=direct;
          urlInput.value=direct;
          toast(/drive\.google\.com/i.test(raw) ? 'Link do Google Drive convertido para download direto.' : 'Link do GitHub convertido para o link raw.');
        }
      };
      const testBtn=row.querySelector('.v3d-test');
      testBtn.onclick=()=>{
        const raw=(rows[i].url||'').trim();
        if(!raw){toastError('Cole uma URL antes de testar.');return;}
        const url=normalizeAssetUrl(raw);
        if(url!==raw){ rows[i].url=url; urlInput.value=url; }
        testBtn.disabled=true; testBtn.textContent='Carregando…';
        testGlbUrl(url).then(({ok,message})=>{
          testBtn.disabled=false;
          testBtn.textContent = ok ? '✓ Carregou' : '✕ Falhou';
          testBtn.style.color = ok ? '#2E8B57' : 'var(--over)';
          if(!ok){
            // TypeError/"Failed to fetch"/"NetworkError" = a requisição nem
            // completou (rede, CORS, DNS...). Mensagem citando THREE/GLTFLoader
            // = a biblioteca 3D (carregada via CDN) ainda não tinha terminado
            // de carregar quando você clicou. Qualquer outra mensagem = o
            // arquivo chegou no navegador mas não é um .glb válido (corrompido,
            // gltf separado sem os .bin/texturas, Draco sem decoder etc.) —
            // nesse caso as dicas de host (Drive/GitHub/R2) não se aplicam.
            const looksLikeLibNotReady=/THREE|GLTFLoader|is not a constructor|is not defined/i.test(message||'');
            const looksLikeNetworkFail=!looksLikeLibNotReady && (!message || /fetch|network|cors|failed to load/i.test(message));
            let hint='';
            if(looksLikeLibNotReady){
              hint=' A biblioteca 3D (carregada de um CDN) ainda não tinha terminado de carregar. Recarregue a página, espere alguns segundos e tente de novo.';
            } else if(looksLikeNetworkFail){
              if(/drive\.google\.com/i.test(url)) hint=' Prefira GitHub público (arquivo pequeno) ou um bucket do Cloudflare R2 (arquivo grande).';
              else if(/raw\.githubusercontent\.com/i.test(url)) hint=' Confira se o repositório é público e se o caminho/branch do link estão corretos. Acima de ~100MB o GitHub recusa o upload — use R2 nesse caso.';
              else if(/\.r2\.dev|r2\.cloudflarestorage\.com/i.test(url)) hint=' Confira se o bucket está com acesso público habilitado e se a política de CORS permite este domínio (Settings → CORS Policy).';
              else hint=' Confira se o link é público e se o servidor libera CORS para este domínio.';
            } else {
              hint=' O link carregou, mas o conteúdo não é um .glb válido (arquivo corrompido, exportado como .gltf separado sem os .bin/texturas junto, ou usa compressão Draco sem o decoder disponível).';
            }
            toastError('Não carregou' + (message?` (${message})`:'') + '.' + hint);
          }
          setTimeout(()=>{ testBtn.textContent='Testar'; testBtn.style.color=''; }, 2600);
        });
      };
      row.querySelector('.v3d-del').onclick=()=>{ rows.splice(i,1); paint(); };
      listEl.appendChild(row);
    });
  }
  paint();
  document.getElementById(prefix+'_3d_add').onclick=()=>{
    rows.push({id:uid(), role:'base', label:'', url:''});
    paint();
  };
  document.getElementById(prefix+'_3d_copy').onclick=()=>{
    model3dClipboardByPrefix[prefix]=JSON.parse(JSON.stringify(rows));
    toast('Peças do modelo 3D copiadas! Cole em outro tipo.');
  };
  document.getElementById(prefix+'_3d_paste').onclick=()=>{
    const clip=model3dClipboardByPrefix[prefix];
    if(!clip){toastError('Nenhuma peça de modelo 3D copiada ainda.');return;}
    rows=JSON.parse(JSON.stringify(clip));
    paint();
    toast('Peças do modelo 3D coladas com sucesso.');
  };

  return {
    getModel3D(){
      const clean=rows
        .filter(v=>v.url&&v.url.trim())
        .map(v=>({ id:v.id||uid(), role:v.role||'base', label:(v.label||'').trim(), url:normalizeAssetUrl(v.url.trim()) }));
      return clean.length ? {parts:clean} : null;
    }
  };
}


function openWallTypeModal(id, cloneFrom){
  editingWallType=id?wallTypeOf(id):null;
  const src=(!editingWallType&&cloneFrom)?wallTypeOf(cloneFrom):null;
  const t=src
    ?{...src, name:"Cópia de "+src.name, tabIds:[...(src.tabIds||["geral"])]}
    :editingWallType||{name:"",length:2.00,thickness:0.10,door:null,doors:[],defaultRot:0,tabIds:["geral"]};
  // Initialize wtDoors from existing data
  wtDoors=(t.doors&&t.doors.length)?t.doors.map(d=>({...d})):(t.door?[{...t.door}]:[]);
  const modalTitle=src?`Duplicar: ${esc(src.name)}`:(id?"Editar tipo de parede":"Novo tipo de parede");
  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML=`<h3>${modalTitle}</h3>
    
    <!-- Exibir nas abas (sempre visível no topo) -->
    <div class="field" data-planta-style="planta-inline-020"><label>Exibir nas abas:</label>
      <div data-planta-style="planta-inline-021">
        ${(state.tabs||[{id:'geral',name:'Geral'}]).map(tab => `
          <label data-planta-style="planta-inline-022">
            <input type="checkbox" class="tab-cb" value="${tab.id}" ${(t.tabIds||['geral']).includes(tab.id)?'checked':''} ${tab.id==='geral'?'disabled checked':''} data-planta-style="planta-inline-023">
            ${esc(tab.name)}
          </label>
        `).join("")}
      </div>
    </div>

    <!-- Categoria 1: Informações Básicas -->
    <details class="tm-section" open>
      <summary>📐 Informações Básicas</summary>
      <div class="tm-body">
        <p class="sub" data-planta-style="planta-inline-024">A parede sempre começa no ponto que você clicar ao posicioná-la na planta (extremidade esquerda/inferior).</p>
        <div class="field"><label>Nome / código</label><input id="wt_name" value="${esc(t.name)}" placeholder="ex: Parede Banheiro"></div>
        <div class="two">
          <div class="field"><label>Espessura (m)</label><input id="wt_th" type="number" step="0.01" value="${t.thickness}"></div>
          <div class="field"><label>Comprimento (m)</label><input id="wt_len" type="number" step="0.01" value="${t.length}"></div>
        </div>
      </div>
    </details>

    <!-- Categoria 2: Predefinições do Modelo -->
    <details class="tm-section">
      <summary>⚙ Predefinições do Modelo</summary>
      <div class="tm-body">
        <div class="field">
          <label>Rotação inicial ao posicionar</label>
          <div data-planta-style="planta-inline-025">
            <button type="button" class="tbtn" id="wt_rot_btn" data-planta-style="planta-inline-026">↻ <span id="wt_rot_val">0°</span></button>
            <span class="sub" data-planta-style="planta-inline-027">Toda vez que você for posicionar esta parede, ela já começa girada assim.</span>
          </div>
        </div>

        <!-- Sub-accordion: Bloquear em tipos de piso -->
        <details class="tm-section">
          <summary>🔒 Bloquear em Tipos de Piso</summary>
          <div class="tm-body">
            <p class="sub" data-planta-style="planta-inline-024">Vazio = sem bloqueio. Se preenchido, esta parede só pode ser usada junto com os pisos marcados.</p>
            <div data-planta-style="planta-inline-028">
              ${state.types.filter(tp=>!isMez(tp)).map(tp=>'<label data-planta-style="planta-inline-029"><input type="checkbox" class="wt-piso-cb" value="'+tp.id+'" '+((t.allowedPisoIds||[]).includes(tp.id)?'checked':'')+' data-planta-style="planta-inline-030"> '+esc(tp.name)+'</label>').join('')}
            </div>
          </div>
        </details>
      </div>
    </details>

    <!-- Categoria 3: Opcionais -->
    <details class="tm-section">
      <summary>✨ Opcionais</summary>
      <div class="tm-body">

        <!-- Sub-accordion: Portas -->
        <details class="tm-section" ${wtDoors.length>0?"open":""}>
          <summary>🚪 Portas / Aberturas</summary>
          <div class="tm-body">
            <div data-planta-style="planta-inline-031">
              <span class="sub" data-planta-style="planta-inline-027">Aberturas cadastradas nesta parede.</span>
              <button type="button" class="tbtn" id="wt_add_door" data-planta-style="planta-inline-032">+ Adicionar abertura</button>
            </div>
            <div id="wt_doors_list"></div>
            <div class="field" id="wt_flex_row" data-planta-style="planta-inline-033"><label data-planta-style="planta-inline-034">
              <input type="checkbox" id="wt_flex" data-planta-style="planta-inline-030" ${t.doorFlexible?"checked":""}> Liberar escolha de abertura na planta (1ª porta, por instância)</label></div>
          </div>
        </details>

        <!-- Sub-accordion: Oitão -->
        <details class="tm-section" ${t.possuiPossibilidadeOitao?"open":""}>
          <summary>△ Possibilidade de Oitão</summary>
          <div class="tm-body">
            <div class="field" data-planta-style="planta-inline-018"><label data-planta-style="planta-inline-034">
              <input type="checkbox" id="wt_oitao_chk" data-planta-style="planta-inline-030" ${t.possuiPossibilidadeOitao?"checked":""}> △ Ativar possibilidade de oitão</label></div>
            <div id="wt_oitao_nome_row" data-planta-display="${t.possuiPossibilidadeOitao ? 'visible' : 'hidden'}">
              <div class="field">
                <label>Nome do Oitão <span data-planta-style="planta-inline-035">(label visual no SVG)</span></label>
                <input id="wt_oitao_nome" value="${esc(t.nomeOitao||"")}" placeholder="Ex: Oitão Parede">
                <label data-planta-style="planta-inline-036">
                  <input type="checkbox" id="wt_oitao_default" data-planta-style="planta-inline-030" ${t.oitaoDefaultAtivo?"checked":""}> Ativado por padrão ao posicionar
                </label>
              </div>
            </div>
          </div>
        </details>

      </div>
    </details>

    ${renderModel3DSectionHTML('wt', t)}

    <!-- BOM como accordion colapsado -->
    <details class="tm-section">
      <summary><span class="bom-title" data-planta-style="planta-inline-015">📦 Composição Real (BOM)
        <span data-planta-style="planta-inline-016" data-planta-stop-propagation="true">
          <button type="button" class="tbtn" id="wt_bom_copy" data-planta-style="planta-inline-017" title="Copiar BOM desta parede">📋 Copiar</button>
          <button type="button" class="tbtn" id="wt_bom_paste" data-planta-style="planta-inline-017" title="Colar BOM copiado">📌 Colar</button>
        </span>
      </span></summary>
      <div class="tm-body">
        <div data-planta-style="planta-inline-037">
          <button type="button" class="tbtn" id="wt_bom_add" data-planta-style="planta-inline-017">+ Produto Real</button>
        </div>
        <div id="wt_bom_list"></div>
        <p class="sub" data-planta-style="planta-inline-038">Condições baseadas na posição da esquadria (dobradiça). Se vazio, o quantitativo usa o nome da parede como produto.</p>
      </div>
    </details>

    <div class="modal-actions">${id?'<button class="del-link" id="wt_del">Excluir tipo</button>':''}
      <button class="tbtn" id="wt_cancel">Cancelar</button><button class="tbtn primary" id="wt_save">Salvar</button></div>`;

  // Render dynamic door list
  renderWtDoors();
  document.getElementById("wt_add_door").onclick=()=>{
    wtDoors.push({at:0.10+wtDoors.length*0.90,w:0.80,tipo:"porta_giro",opens:"fora",hinge:"esquerda",name:"",showName:true});
    renderWtDoors();
  };

  // ── BOM Editor da Parede ──────────────────────────────────────────────
  const wtProdOptions = (pricingData?.produtos||[])
    .map(p=>`<option value="${esc(p.nome)}">${esc(p.nome)}</option>`).join('');
  const wtBomCondOptions = [
    {v:"padrao",            l:"Padrão / Sempre"},
    {v:"esq_esquadria_esq", l:"Se Esquadria = Esquerda"},
    {v:"esq_esquadria_dir", l:"Se Esquadria = Direita"},
    {v:"oitao_ativo",       l:"Se Oitão Ativo"},
  ].map(c=>`<option value="${c.v}">${c.l}</option>`).join('');

  let wtBomRows = JSON.parse(JSON.stringify(t.bomConfig||[]));

  function renderWtBomList(){
    const list = document.getElementById("wt_bom_list");
    if(!list) return;
    list.innerHTML = '';
    wtBomRows.forEach((row, i) => {
      const div = document.createElement('div');
      div.className = 'bom-row';
      div.innerHTML = `
        <select class="bom-prod">${wtProdOptions}</select>
        <select class="bom-cond">${wtBomCondOptions}</select>
        <input class="bom-qty" type="number" min="0.1" step="0.5" value="${row.qty||1}">
        <button class="bom-del" data-i="${i}" title="Remover">✕</button>`;
      div.querySelector('.bom-prod').value = row.produtoNome || '';
      div.querySelector('.bom-cond').value = row.condicao || 'padrao';
      div.querySelector('.bom-prod').onchange = e => { wtBomRows[i].produtoNome = e.target.value; };
      div.querySelector('.bom-cond').onchange = e => { wtBomRows[i].condicao = e.target.value; };
      div.querySelector('.bom-qty').onchange  = e => { wtBomRows[i].qty = Math.max(0.1, parseFloat(e.target.value)||1); };
      div.querySelector('.bom-del').onclick   = () => { wtBomRows.splice(i,1); renderWtBomList(); };
      list.appendChild(div);
    });
  }
  renderWtBomList();
  document.getElementById("wt_bom_add").onclick = () => {
    const firstProd = (pricingData?.produtos||[])[0]?.nome || '';
    wtBomRows.push({produtoNome: firstProd, condicao: 'padrao', qty: 1});
    renderWtBomList();
  };
  document.getElementById("wt_bom_copy").onclick = () => {
    wtBomClipboard = JSON.parse(JSON.stringify(wtBomRows));
    toast("BOM da parede copiado! Cole em outra parede.");
  };
  document.getElementById("wt_bom_paste").onclick = () => {
    if(!wtBomClipboard){toastError("Nenhum BOM de parede copiado ainda.");return;}
    wtBomRows = JSON.parse(JSON.stringify(wtBomClipboard));
    renderWtBomList();
    toast("BOM colado com sucesso.");
  };

  let curDefaultRot=t.defaultRot||0;
  document.getElementById("wt_rot_val").textContent=curDefaultRot+"°";
  document.getElementById("wt_rot_btn").onclick=()=>{
    curDefaultRot=(curDefaultRot+90)%360;
    document.getElementById("wt_rot_val").textContent=curDefaultRot+"°";
  };

  // No wt_door checkbox anymore - doors managed dynamically
  document.getElementById("wt_cancel").onclick=closeModal;
  if(id)document.getElementById("wt_del").onclick=()=>{
    if(usedCountWall(id)&&!confirm("Há paredes desse tipo na planta. Excluir o tipo e remover as paredes?"))return;
    state.wallInstances=state.wallInstances.filter(wi=>wi.wallTypeId!==id);
    state.wallTypes=state.wallTypes.filter(wt=>wt.id!==id);
    closeModal();renderInv();render();
  };
  // Wire wall oitão checkbox visibility
  const wtOitaoChk=document.getElementById("wt_oitao_chk");
  const wtOitaoNomeRow=document.getElementById("wt_oitao_nome_row");
  if(wtOitaoChk) wtOitaoChk.onchange=()=>{if(wtOitaoNomeRow) wtOitaoNomeRow.style.display=wtOitaoChk.checked?"":"none";};

  document.getElementById("wt_save").onclick=()=>{
    saveState();
    const name=document.getElementById("wt_name").value.trim()||"Parede";
    const thickness=Math.max(0.02,parseFloat(document.getElementById("wt_th").value)||0.10);
    const length=Math.max(0.10,parseFloat(document.getElementById("wt_len").value)||2.00);
    const defaultRot=parseInt(document.getElementById("wt_rot_val").textContent,10)||0;
    
    let tabIds = Array.from(document.querySelectorAll('.tab-cb:checked')).map(cb => cb.value);
    if(!tabIds.includes("geral")) tabIds.push("geral");

    // Collect doors from dynamic list
    const doorsData=wtDoors.map(d=>({
      at:Math.max(0,parseFloat(d.at)||0),
      w:Math.max(0.3,parseFloat(d.w)||0.8),
      tipo:d.tipo||"porta_giro",
      opens:d.opens||"fora",hinge:d.hinge||"esquerda",
      name:d.name||"",showName:d.showName!==false
    }));
    const door=doorsData.length>0?doorsData[0]:null;
    const doorFlexible=!!(doorsData.length>0&&document.getElementById("wt_flex").checked);
    const allowedPisoIds=Array.from(document.querySelectorAll(".wt-piso-cb:checked")).map(cb=>cb.value);

    // Oitão da parede
    const wtOChk=document.getElementById("wt_oitao_chk");
    const possuiPossibilidadeOitao=!!(wtOChk&&wtOChk.checked);
    const nomeOitao=possuiPossibilidadeOitao?(document.getElementById("wt_oitao_nome")?.value?.trim()||""):"";
    const oitaoDefaultAtivo=possuiPossibilidadeOitao&&!!(document.getElementById("wt_oitao_default")?.checked);

    const model3d=model3dApi.getModel3D();

    if(editingWallType)Object.assign(editingWallType,{name,length,thickness,door,doors:doorsData,doorFlexible,allowedPisoIds,defaultRot,tabIds,bomConfig:wtBomRows,possuiPossibilidadeOitao,nomeOitao,oitaoDefaultAtivo,model3d});
    else state.wallTypes.push({id:uid(),name,length,thickness,door,doors:doorsData,doorFlexible,allowedPisoIds,defaultRot,tabIds,bomConfig:wtBomRows,possuiPossibilidadeOitao,nomeOitao,oitaoDefaultAtivo,model3d});
    closeModal();renderInv();render();
  };
  const model3dApi=wireModel3DSection('wt', t);
  scrim.classList.add("show");setTimeout(()=>document.getElementById("wt_name").focus(),50);
}

function renderTabs() {
  const tc = document.getElementById("tabsContainer");
  if(!tc) return;
  tc.innerHTML = "";
  const isUsed = state.panels.length > 0 || state.wallInstances.length > 0;

  (state.tabs || []).forEach(tab => {
    const b = document.createElement("button");
    b.className = "tbtn " + (state.activeTab === tab.id ? "active" : "");
    b.textContent = tab.name;
    if (isUsed && state.activeTab !== tab.id) {
       b.style.opacity = "0.5";
    }
    b.onclick = () => {
      if (state.activeTab === tab.id) return;
      if (isUsed) {
        toastError("Planta em uso. Limpe a planta (Nova) para trocar de aba.");
        return;
      }
      state.activeTab = tab.id;
      renderTabs();
      renderInv();
    };
    tc.appendChild(b);
  });

  const n = document.createElement("button");
  n.className = "tbtn";
  n.style.color = "var(--accent)";
  n.textContent = "+ Aba";
  n.onclick = () => {
    requireAdmin(() => {
      openTextModal("Nova Aba", "", txt => {
        if(txt && txt.trim()) {
          saveState();
          const newTab = {id: uid(), name: txt.trim()};
          if(!state.tabs) state.tabs = []; 
          state.tabs.push(newTab);
          if(!isUsed) state.activeTab = newTab.id; 
          renderTabs();
          renderInv();
        }
      });
    });
  };
  tc.appendChild(n);
}

function usedCount(id){return state.panels.filter(p=>p.typeId===id).length;}
function usedCountWall(id){return state.wallInstances.filter(wi=>wi.wallTypeId===id).length;}

function renderInv(){
  const inv=document.getElementById("inv");inv.innerHTML="";
  const isAndar2=state.floorMode==='andar2';

  if(isAndar2){
    const hint=document.createElement("div");
    hint.style.cssText="margin:4px 4px 12px;padding:10px 12px;background:var(--accent-soft);border:1px solid var(--accent-line);border-radius:10px;font-size:12px;color:var(--ink)";
    hint.innerHTML="<b>Modo 2&#186; andar.</b> O 1&#186; andar aparece escurecido, s&oacute; como refer&ecirc;ncia. Aqui voc&ecirc; posiciona apenas mezaninos e escadas &mdash; a posi&ccedil;&atilde;o fica gravada de verdade e &eacute; o que vai pro 3D.";
    inv.appendChild(hint);
  }
  
  const currentTypes = state.types.filter(t => t.tabIds && t.tabIds.includes(state.activeTab));
  const floorTypes = currentTypes.filter(t=>!isMez(t)&&!t.isStair).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt'));
  const mezTypes = currentTypes.filter(t=>isMez(t)).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt'));
  const stairTypes = currentTypes.filter(t=>t.isStair).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt'));

  const renderTypeCard=(ty)=>{
    const used=usedCount(ty.id);
    const isGeral=state.activeTab==='geral';
    const canPlace=!isGeral||isAdmin();
    const card=document.createElement("div");card.className="ptype"+(armedType===ty.id?" armed":"")+(isGeral&&!isAdmin()?" geral-only":"");
    let swatchStyle = `background:${ty.color}`;
    if (ty.hwall) swatchStyle = (ty.hwall.twoTone!==false)
      ? `background: linear-gradient(180deg, ${WOOD_L} 50%, ${WOOD_D} 50%)`
      : `background: ${WOOD_L}`;
    if (isMez(ty)) swatchStyle = `background: ${WOOD_L}`;
    if (ty.isStair) swatchStyle = `background: repeating-linear-gradient(180deg, #CFC8B8 0, #CFC8B8 3px, #8A8272 3px, #8A8272 4px)`;
    const D=footD(ty);
    const dimsTxt = isMez(ty)
      ? `${fmt(ty.w)} × ${fmt(ty.d)} m · ${fmt(ty.w*ty.d)} m²`
      : ty.isStair
      ? `${fmt(ty.w)} × ${fmt(ty.d)} m${ty.patamar?` · patamar ${fmt(ty.patamarComprimento||0.9)} m`:' · sem patamar'}`
      : `${fmt(ty.w)} × ${fmt(ty.d)} m · ${fmt(ty.w*ty.d)} m²`;
    const precoUnit=getPriceForType(ty.name);
    const priceBadge=precoUnit!==null
      ? `<span class="q-price-badge has-price">R$ ${precoUnit.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>`
      : '';
    const adminBtns=isAdmin()?`
      <button class="mini" data-dup="${ty.id}" title="Duplicar tipo">⧉</button>
      <button class="mini" data-edit="${ty.id}">editar</button>`:'';
    card.innerHTML=`<div class="row1"><span class="swatch" data-planta-swatch="${swatchStyle}"></span>
      <span class="pname">${isMez(ty)?"🏗 ":ty.isStair?"🪜 ":""}${esc(ty.name)}</span>
      ${adminBtns}</div>
      <div class="dims">${dimsTxt}</div>
      ${priceBadge}
      <div class="budget"><div class="nums"><span>em uso: <b>${used}</b></span></div></div>`;
    if(canPlace) card.addEventListener("click",e=>{if(e.target.dataset.edit||e.target.dataset.dup)return;armPlace(ty.id);});
    else if(isGeral && !isAdmin()) {
      // Gestor/Vendedor na aba Geral: intercepta o clique e exibe aviso orientando o usuário
      card.addEventListener("click", e => {
        if(e.target.dataset.edit || e.target.dataset.dup) return;
        toastError("Você precisa escolher a aba de algum modelo para poder continuar.");
      });
    }
    if(isAdmin()){
      card.querySelector("[data-edit]")?.addEventListener("click",e=>{e.stopPropagation();
        requireAdmin(()=> ty.isStair ? openStairModal(ty.id) : openTypeModal(ty.id));});
      card.querySelector("[data-dup]")?.addEventListener("click",e=>{e.stopPropagation();
        requireAdmin(()=> ty.isStair ? openStairModal(null,ty.id) : openTypeModal(null,false,ty.id));});
    }
    inv.appendChild(card);
  };

  if(!isAndar2){
  floorTypes.forEach(renderTypeCard);
  
  if(state.activeTab === 'geral' && isAdmin()){
    const addFloor=document.createElement("button");
    addFloor.className="add-type";addFloor.textContent="+ Adicionar tipo de piso";
    addFloor.style.margin="4px";
    addFloor.onclick=()=>requireAdmin(()=>openTypeModal(null));
    inv.appendChild(addFloor);
  }
  }

  const mezHead=document.createElement("div");
  mezHead.style.cssText="margin:14px 4px 4px;padding-top:10px;border-top:1px solid var(--line);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint);font-weight:700";
  mezHead.textContent="Mezaninos disponíveis";
  if(isAndar2){

  inv.appendChild(mezHead);

  mezTypes.forEach(renderTypeCard);

  if(state.activeTab === 'geral' && isAdmin()){
    const addMez=document.createElement("button");
    addMez.className="add-type";addMez.textContent="+ Adicionar mezanino";
    addMez.style.margin="4px";
    addMez.onclick=()=>requireAdmin(()=>openTypeModal(null,true));
    inv.appendChild(addMez);
  }

  const stairHead=document.createElement("div");
  stairHead.style.cssText="margin:14px 4px 4px;padding-top:10px;border-top:1px solid var(--line);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint);font-weight:700";
  stairHead.textContent="Escadas disponíveis";
  inv.appendChild(stairHead);

  stairTypes.forEach(renderTypeCard);

  if(state.activeTab === 'geral' && isAdmin()){
    const addStair=document.createElement("button");
    addStair.className="add-type";addStair.textContent="+ Adicionar escada";
    addStair.style.margin="4px";
    addStair.onclick=()=>requireAdmin(()=>openStairModal(null));
    inv.appendChild(addStair);
  }
  }

  if(!isAndar2){
  const wallHead=document.createElement("div");
  wallHead.style.cssText="margin:14px 4px 4px;padding-top:10px;border-top:1px solid var(--line);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint);font-weight:700";
  wallHead.textContent="Paredes disponíveis";
  inv.appendChild(wallHead);

  const currentWallTypes = state.wallTypes.filter(wt => wt.tabIds && wt.tabIds.includes(state.activeTab)).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt'));
  currentWallTypes.forEach(wt=>{
    const used=usedCountWall(wt.id);
    const isGeral=state.activeTab==='geral';
    const canPlace=!isGeral||isAdmin();
    const info=wallTypeRectInfo(wt);
    const _selPanel2=state.panels.find(p=>p.id===selId);
    const _pisoTid=_selPanel2?_selPanel2.typeId:null;
    const _wtOk=!(wt.allowedPisoIds&&wt.allowedPisoIds.length>0)||!_pisoTid||!wt.allowedPisoIds.includes(_pisoTid);
    const card=document.createElement("div");card.className="ptype"+(armedWallType===wt.id?" armed":"")+(isGeral&&!isAdmin()?" geral-only":"");
    if(!_wtOk){card.style.opacity="0.35";card.title="Incompatível com o tipo de piso selecionado";}
    const wallAdminBtns=isAdmin()?`
      <button class="mini" data-dup="${wt.id}" title="Duplicar parede">⧉</button>
      <button class="mini" data-edit="${wt.id}">editar</button>`:'';
    card.innerHTML=`<div class="row1"><span class="swatch" data-planta-style="planta-inline-039"></span>
      <span class="pname">${esc(wt.name)}</span>
      ${wallAdminBtns}</div>
      <div class="dims">${fmt(info.length)} m · esp. ${fmt(info.thickness)} m${wt.door?" · 🚪 com porta":""}</div>
      <div class="budget"><div class="nums"><span>em uso: <b>${used}</b></span></div></div>`;
    if(canPlace) card.addEventListener("click",e=>{if(e.target.dataset.edit||e.target.dataset.dup)return;armWallPlace(wt.id);});
    else if(isGeral && !isAdmin()) {
      // Gestor/Vendedor na aba Geral: intercepta o clique e exibe aviso orientando o usuário
      card.addEventListener("click", e => {
        if(e.target.dataset.edit || e.target.dataset.dup) return;
        toastError("Você precisa escolher a aba de algum modelo para poder continuar.");
      });
    }
    if(isAdmin()){
      card.querySelector("[data-edit]")?.addEventListener("click",e=>{e.stopPropagation();requireAdmin(()=>openWallTypeModal(wt.id));});
      card.querySelector("[data-dup]")?.addEventListener("click",e=>{e.stopPropagation();requireAdmin(()=>openWallTypeModal(null,wt.id));});
    }
    inv.appendChild(card);
  });
  
  if(state.activeTab === 'geral' && !isAdmin()){
    const hint=document.createElement("p");
    hint.style.cssText="font-size:11px;color:var(--ink-faint);margin:8px 4px 0;line-height:1.5;";
    hint.textContent="Na aba Geral só é possível criar e editar tipos. Para usar, selecione outra aba.";
    inv.appendChild(hint);
  }
  
  if(state.activeTab === 'geral' && isAdmin()){
    const addWall=document.createElement("button");
    addWall.className="add-type";addWall.textContent="+ Adicionar tipo de parede";
    addWall.style.margin="4px";
    addWall.onclick=()=>requireAdmin(()=>openWallTypeModal(null));
    inv.appendChild(addWall);
  }
  }

  const totUsed=state.panels.length;
  document.getElementById("totals").innerHTML=
    `<div class="line"><span>Pisos em uso</span><b>${totUsed}</b></div>
     <div class="line area"><span>Área ocupada</span><b>${fmt(occupiedArea())} m²</b></div>`;
}
function armPlace(id){tool="place";armedType=id;armedWallType=null;selId=null;selIds=new Set();
  const ty=typeOf(id);ghostRot=(ty&&ty.defaultRot)||0;setTool();renderInv();render();}
function armWallPlace(id){tool="placewall";armedWallType=id;armedType=null;selId=null;selIds=new Set();
  const wt=wallTypeOf(id);ghostRot=(wt&&wt.defaultRot)||0;setTool();renderInv();render();}


let activePointers = new Map();
let initialPinchDist = null;
let initialPinchScale = null;
let pinchCenter = null;

svg.addEventListener("pointerdown",ev=>{
  ev.preventDefault();
  svg.setPointerCapture(ev.pointerId);
  activePointers.set(ev.pointerId, ev);

  if(activePointers.size === 2) {
    const pts = Array.from(activePointers.values());
    initialPinchDist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
    initialPinchScale = view.scale;
    pinchCenter = {
      x: (pts[0].clientX + pts[1].clientX)/2,
      y: (pts[0].clientY + pts[1].clientY)/2
    };
    return;
  }

  if(ev.button===1){drag={kind:"pan",sx:ev.clientX,sy:ev.clientY,tx:view.tx,ty:view.ty,hasMoved:false};svg.classList.add("panning");render();return;}
  const[wx,wy]=toWorld(ev.clientX, ev.clientY);
  // ── Linha de chamada (âncora) de rótulo: aguarda o próximo clique no
  // canvas para fixar o ponto, independente da ferramenta ativa ─────────
  if(setLeaderAnchorMode){
    const lb=state.labels.find(l=>l.id===setLeaderAnchorMode);
    setLeaderAnchorMode=null;
    if(lb){
      saveState();
      lb.leaderAnchor={x:wx,y:wy};
      render();renderSelbar();
      toast("📍 Âncora da linha de chamada definida.");
    }
    return;
  }
  if(tool==="place"&&armedType){placeAt(wx,wy);return;}
  if(tool==="label"){addLabel(wx,wy);return;}
  if(tool==="dim"){
    if(dimDraftP1&&dimDraftP2){
      // 3rd click: lock in the dimension line's position along the fixed axis.
      const axis=dimDraftAxis;
      const rawPos=axis==="x"?wy:wx;
      const linePos=getSnappedLinePos(axis,rawPos,null);
      saveState();
      state.manualDims.push({
        id:uid(), p1:[dimDraftP1[0],dimDraftP1[1]], p2:[dimDraftP2[0],dimDraftP2[1]], axis, linePos,
        p1Anchor:dimDraftP1.anchor||null, p2Anchor:dimDraftP2.anchor||null,
        andar: state.floorMode==='andar2'?2:1
      });
      dimDraftP1=null;dimDraftP2=null;dimMousePt=null;dimDraftAxis=null;
      render();
      return;
    }
    if(!dimDraftP1){
      // Clicking an existing cota with the dim tool active moves it,
      // instead of starting a brand-new dimension.
      const dimHit=ev.target.closest("[data-dim]");
      if(dimHit){
        selId=dimHit.getAttribute("data-dim");
        dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
        drag={kind:"manualdim",id:selId, hasMoved:false};
        renderInv();render();return;
      }
    }
    const snapPt=nearestDimSnapPoint(wx,wy,16);
    if(!snapPt){toastError("Clique perto de uma aresta de parede ou extremidade de piso.");return;}
    if(!dimDraftP1){dimDraftP1=snapPt;render();return;}
    if(Math.hypot(snapPt[0]-dimDraftP1[0],snapPt[1]-dimDraftP1[1])<0.02){dimDraftP1=null;render();return;}
    dimDraftP2=snapPt;dimDraftAxis=dimAxisOf(dimDraftP1,dimDraftP2);dimMousePt=snapPt;render();
    return;
  }
  if(tool==="placewall"&&armedWallType){placeWallAt(wx,wy);return;}
  const nameEl=ev.target.closest("[data-name]");
  if(tool==="select"&&nameEl){
    const id=nameEl.getAttribute("data-name");const p=state.panels.find(p=>p.id===id);
    selId=id; selIds=new Set([id]); p.name=p.name||{};
    dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
    drag={kind:"name",id,dx:wx-(p.cx+(p.name.dx||0)),dy:wy-(p.cy+(p.name.dy||0)), hasMoved:false};
    renderInv();render();return;
  }
  const hit=ev.target.closest("[data-id]"), lbl=ev.target.closest("[data-label]"), wallHit=ev.target.closest("[data-wall-inst]"), dimHit=ev.target.closest("[data-dim]");
  const clickedId = hit?.getAttribute("data-id") || lbl?.getAttribute("data-label") || wallHit?.getAttribute("data-wall-inst") || dimHit?.getAttribute("data-dim");
  
  // Ctrl/Shift+click: adicionar/remover da multi-seleção
  if(tool==="select" && clickedId && (ev.ctrlKey||ev.metaKey||ev.shiftKey)){
    if(selIds.has(clickedId)){
      selIds.delete(clickedId);
      if(selId===clickedId) selId=selIds.size?[...selIds][selIds.size-1]:null;
    } else {
      selIds.add(clickedId);
      selId=clickedId;
    }
    renderInv();render();return;
  }
  
  // Clique normal em item já multi-selecionado → inicia drag de todos
  if(tool==="select" && clickedId && selIds.size>1 && selIds.has(clickedId)){
    dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
    // Captura posições originais de todos os selecionados
    const origStates=[];
    selIds.forEach(id=>{
      const p2=state.panels.find(p=>p.id===id);
      if(p2){origStates.push({type:"panel",id,cx:p2.cx,cy:p2.cy});return;}
      const wi2=state.wallInstances.find(w=>w.id===id);
      if(wi2){origStates.push({type:"wallinst",id,ax:wi2.ax,ay:wi2.ay});return;}
      const l2=state.labels.find(l=>l.id===id);
      if(l2){origStates.push({type:"label",id,x:l2.x,y:l2.y});return;}
      const d2=state.manualDims.find(d=>d.id===id);
      if(d2){origStates.push({type:"dim",id,linePos:d2.linePos,axis:d2.axis});return;}
    });
    drag={kind:"multi",startWX:wx,startWY:wy,origStates,hasMoved:false};
    render();return;
  }
  
  if(tool==="select"&&hit){
    selId=hit.getAttribute("data-id"); selIds=new Set([selId]); const p=state.panels.find(p=>p.id===selId);
    dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
    drag={kind:"panel",id:selId,dx:wx-p.cx,dy:wy-p.cy, hasMoved:false};
    renderInv();render();return;
  }
  if(tool==="select"&&lbl){
    const id=lbl.getAttribute("data-label");const l=state.labels.find(l=>l.id===id);
    const now=Date.now();
    if(lastLabelClick && lastLabelClick.id===id && (now-lastLabelClick.time)<450){
      lastLabelClick=null;selId=id;selIds=new Set([id]);editLabelInline();return;
    }
    lastLabelClick={id,time:now};
    selId=id; selIds=new Set([id]);
    dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
    drag={kind:"label",id,dx:wx-l.x,dy:wy-l.y, hasMoved:false};
    renderInv();render();return;
  }
  if(tool==="select"&&wallHit){
    selId=wallHit.getAttribute("data-wall-inst"); selIds=new Set([selId]); const wi=state.wallInstances.find(w=>w.id===selId);
    dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
    drag={kind:"wallinst",id:selId,startWX:wx,startWY:wy,origAX:wi.ax,origAY:wi.ay, hasMoved:false};
    renderInv();render();return;
  }
  if(tool==="select"&&dimHit){
    selId=dimHit.getAttribute("data-dim"); selIds=new Set([selId]);
    dragInitialState = JSON.stringify({panels: state.panels, labels: state.labels, wallInstances: state.wallInstances, manualDims: state.manualDims});
    drag={kind:"manualdim",id:selId, hasMoved:false};
    renderInv();render();return;
  }
  if(tool==="select"){
    // Arrastando no canvas vazio → seleção por caixa (rubber-band)
    selId=null; selIds=new Set();
    drag={kind:"rubberband",wx0:wx,wy0:wy,wx1:wx,wy1:wy,hasMoved:false};
    render(); return;
  }
  selId=null; selIds=new Set(); drag={kind:"pan",sx:ev.clientX,sy:ev.clientY,tx:view.tx,ty:view.ty, hasMoved:false};
  svg.classList.add("panning");render();
});

svg.addEventListener("pointermove",ev=>{
  if(activePointers.has(ev.pointerId)) activePointers.set(ev.pointerId, ev);

  if(activePointers.size === 2 && initialPinchDist) {
    const pts = Array.from(activePointers.values());
    const curDist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
    const r = svg.getBoundingClientRect();
    const mx = pinchCenter.x - r.left;
    const my = pinchCenter.y - r.top;
    const wx = (mx - view.tx) / view.scale;
    const wy = (my - view.ty) / view.scale;

    view.scale = Math.max(8, Math.min(400, initialPinchScale * (curDist / initialPinchDist)));
    view.tx = mx - wx * view.scale;
    view.ty = my - wy * view.scale;
    updateHud();
    render();
    return;
  }

  const[wx,wy]=toWorld(ev.clientX, ev.clientY);
  if(drag && drag.kind==="pan"){view.tx=drag.tx+(ev.clientX-drag.sx);view.ty=drag.ty+(ev.clientY-drag.sy);render();return;}
  if(tool==="place"&&armedType){ghostPos=(state.floorMode==='andar2'?snapAndar2Center:snapPanelCenter)(wx,wy,armedType,ghostRot);render();return;}
  if(tool==="dim"){
    if(dimDraftP1&&dimDraftP2){dimMousePt=[wx,wy];render();return;}
    dimHoverPt=nearestDimSnapPoint(wx,wy,16);render();return;
  }
  if(tool==="placewall"&&armedWallType){
    let[gx,gy]=[snap(wx),snap(wy)];
    const tmp={wallTypeId:armedWallType,ax:gx,ay:gy,rot:ghostRot};
    [gx,gy]=snapWallToNeighbors(tmp,gx,gy,null);
    ghostPos=[gx,gy];render();return;
  }
  if(!drag)return;
  
  if(drag.kind==="panel"){const p=state.panels.find(p=>p.id===drag.id);
    if(state.floorMode==='andar2' && isFloor2Panel(p)){
      let[cx,cy]=snapAndar2Center(wx-drag.dx,wy-drag.dy,p.typeId,p.rot,p.id,p.patamarLen);
      if(floor2OverlapsAny(cx,cy,dims(p),p.id))return;
      p.cx=cx;p.cy=cy; drag.hasMoved=true; render();return;
    }
    let[cx,cy]=snapPanelCenter(wx-drag.dx,wy-drag.dy,p.typeId,p.rot);
    const[_ncx,_ncy]=snapToNeighbors(p,cx,cy);
    const _pSnapX=(_ncx!==cx),_pSnapY=(_ncy!==cy);
    [cx,cy]=[_ncx,_ncy];
    const[_wcx,_wcy]=snapPanelToWallEdges(p,cx,cy);
    if(!_pSnapX) cx=_wcx; if(!_pSnapY) cy=_wcy;
    if(panelOverlapsAny(cx,cy,dims(p),p.id))return;
    if(pisoIncompativelVizinho(p.typeId,cx,cy,dims(p),p.id))return;
    if(panelWallCompatError(p,cx,cy))return;
    if(panelLateralWallsOverlapWalls(p,cx,cy))return;
    p.cx=cx;p.cy=cy; drag.hasMoved = true; render();return;}
    
  if(drag.kind==="name"){
    const p=state.panels.find(p=>p.id===drag.id);
    const d=dims(p);
    let ndx=snap((wx-drag.dx)-p.cx);
    let ndy=snap((wy-drag.dy)-p.cy);
    const limitX = Math.max(0, d.w/2 - 0.2); 
    const limitY = Math.max(0, d.h/2 - 0.2);
    p.name.dx = Math.max(-limitX, Math.min(limitX, ndx));
    p.name.dy = Math.max(-limitY, Math.min(limitY, ndy));
    drag.hasMoved = true;
    render();
    return;
  }
  if(drag.kind==="label"){const l=state.labels.find(l=>l.id===drag.id);l.x=snap(wx-drag.dx);l.y=snap(wy-drag.dy);drag.hasMoved=true;render();return;}
  if(drag.kind==="wallinst"){
    const wi=state.wallInstances.find(w=>w.id===drag.id);
    const ddx=wx-drag.startWX, ddy=wy-drag.startWY;
    let ax=snap(drag.origAX+ddx), ay=snap(drag.origAY+ddy);
    [ax,ay]=snapWallToNeighbors(wi,ax,ay,wi.id);
    if(wallOverlapsAny({...wi,ax,ay},wi.id))return;
    if(wallPisoCompatError({...wi,ax,ay}))return;
    wi.ax=ax; wi.ay=ay;
    drag.hasMoved=true; render();
  }
  if(drag.kind==="manualdim"){
    const d=state.manualDims.find(d=>d.id===drag.id);if(!d)return;
    const raw=d.axis==="x"?wy:wx;
    d.linePos=getSnappedLinePos(d.axis,raw,d.id);
    drag.hasMoved=true; render();
  }
  if(drag.kind==="rubberband"){
    drag.wx1=wx; drag.wy1=wy;
    if(!drag.hasMoved && Math.abs(drag.wx1-drag.wx0)>0.05 || Math.abs(drag.wy1-drag.wy0)>0.05)
      drag.hasMoved=true;
    render(); return;
  }
  if(drag.kind==="multi"){
    const ddx=wx-drag.startWX, ddy=wy-drag.startWY;
    // Calcula delta snapped a partir de UM item de referência (primeiro painel).
    // Aplicar snap individualmente causaria drift quando os itens não estão
    // todos alinhados ao mesmo grid.
    const ref=drag.origStates.find(o=>o.type==="panel")||drag.origStates[0];
    let snapDx=ddx, snapDy=ddy;
    if(ref&&ref.type==="panel"){
      snapDx=snap(ref.cx+ddx)-ref.cx;
      snapDy=snap(ref.cy+ddy)-ref.cy;
    } else if(ref&&ref.type==="wallinst"){
      snapDx=snap(ref.ax+ddx)-ref.ax;
      snapDy=snap(ref.ay+ddy)-ref.ay;
    }
    drag.origStates.forEach(orig=>{
      if(orig.type==="panel"){
        const p=state.panels.find(p=>p.id===orig.id);
        if(p){p.cx=orig.cx+snapDx;p.cy=orig.cy+snapDy;}
      } else if(orig.type==="wallinst"){
        const w=state.wallInstances.find(w=>w.id===orig.id);
        if(w){
          const nax=orig.ax+snapDx, nay=orig.ay+snapDy;
          if(!wallPisoCompatError({...w,ax:nax,ay:nay})){w.ax=nax;w.ay=nay;}
        }
      } else if(orig.type==="label"){
        const l=state.labels.find(l=>l.id===orig.id);
        if(l){l.x=orig.x+snapDx;l.y=orig.y+snapDy;}
      } else if(orig.type==="dim"){
        const d=state.manualDims.find(d=>d.id===orig.id);
        if(d){d.linePos=orig.axis==="x"?(orig.linePos+snapDy):(orig.linePos+snapDx);}
      }
    });
    drag.hasMoved=true; render();
  }
});

function endPointer(ev){
  activePointers.delete(ev.pointerId);
  if(activePointers.size < 2) initialPinchDist = null;
  endDrag();
}
function rectFromRubberband(d){
  const x=Math.min(d.wx0,d.wx1), y=Math.min(d.wy0,d.wy1);
  return {x,y,w:Math.abs(d.wx1-d.wx0),h:Math.abs(d.wy1-d.wy0)};
}
function endDrag(){
  if(drag){
    if(drag.kind==="rubberband"){
      if(drag.hasMoved){
        const rb=rectFromRubberband(drag);
        const newSel=new Set();
        const _andar2=state.floorMode==='andar2';
        state.panels.forEach(p=>{
          if(isFloor2Panel(p)!==_andar2)return; // só seleciona painéis do andar sendo exibido agora
          const r=rectOf(p);if(rectsOverlap({...rb,x:rb.x+0.001,y:rb.y+0.001,w:rb.w-0.002,h:rb.h-0.002},r))newSel.add(p.id);
        });
        if(!_andar2){
          state.wallInstances.forEach(wi=>{const r=wallAABB(wi);if(r&&rectsOverlap(rb,r))newSel.add(wi.id);});
          state.labels.forEach(l=>{if(l.x>=rb.x&&l.x<=rb.x+rb.w&&l.y>=rb.y&&l.y<=rb.y+rb.h)newSel.add(l.id);});
        }
        // Cotas manuais também entram na seleção por caixa — usa a posição
        // ATUAL da linha de cota (já considerando âncoras) com uma folga
        // mínima, já que a linha em si não tem espessura.
        (state.manualDims||[]).filter(d=>(d.andar||1)===(_andar2?2:1)).forEach(d=>{
          const p1=resolveDimPoint(d,'p1'), p2=resolveDimPoint(d,'p2');
          const{lineP1:q1,lineP2:q2}=dimAxisGeom(p1,p2,d.axis,d.linePos);
          const pad=0.05;
          const r={x:Math.min(q1[0],q2[0])-pad, y:Math.min(q1[1],q2[1])-pad,
                   w:Math.abs(q2[0]-q1[0])+pad*2, h:Math.abs(q2[1]-q1[1])+pad*2};
          if(rectsOverlap(rb,r))newSel.add(d.id);
        });
        if(newSel.size){selIds=newSel;selId=[...newSel][0]||null;}
      }
      drag=null; render(); return;
    }
    if(drag.hasMoved && drag.kind !== "pan" && dragInitialState){
      historyStack.push(dragInitialState);
      if(historyStack.length > 50) historyStack.shift();
      redoStack = []; // arrastar é ação nova, apaga redo
      renderTabs(); 
    }
    drag=null; svg.classList.remove("panning"); dragInitialState=null; renderInv();
  }
}
svg.addEventListener("pointerup",endPointer);
svg.addEventListener("pointercancel",endPointer);
svg.addEventListener("dblclick",ev=>{
  const n=ev.target.closest("[data-name]");if(n){selId=n.getAttribute("data-name");renameSel();return;}
  const l=ev.target.closest("[data-label]");if(l){selId=l.getAttribute("data-label");editLabelInline();return;}
});

let activeInlineEdit=null;
document.addEventListener("pointerdown",ev=>{
  if(activeInlineEdit && ev.target!==activeInlineEdit.input){
    activeInlineEdit.commit();
  }
},true);

// ── Abrir/fechar suave dos grupos recolhíveis (<details class="tm-section">,
// ex: "Informações Básicas" nos editores de tipo) ──────────────────────────
// São <details>/<summary> nativos, redesenhados dinamicamente em vários
// modais — por isso o listener fica no document (delegação), cobrindo
// qualquer grupo atual ou futuro sem precisar religar nada a cada render.
document.addEventListener("click", ev=>{
  const summary = ev.target.closest(".tm-section > summary");
  if(!summary) return;
  const details = summary.parentElement;
  const body = details.querySelector(":scope > .tm-body");
  if(!body) return; // sem corpo pra animar, deixa o comportamento nativo
  ev.preventDefault(); // assume o controle manual da abertura/fechamento

  if(details.open){
    // Já aberto → anima o fechamento antes de tirar o "open"
    const h = body.scrollHeight;
    body.style.overflow="hidden";
    body.style.height=h+"px";
    body.getBoundingClientRect(); // força reflow pra pegar o "de onde" antes do "pra onde"
    body.style.transition="height .18s ease";
    requestAnimationFrame(()=>{ body.style.height="0px"; });
    body.addEventListener("transitionend", function te(){
      body.removeEventListener("transitionend", te);
      details.open=false;
      body.style.cssText="";
    }, {once:true});
  } else {
    details.open=true;
    const h = body.scrollHeight;
    body.style.overflow="hidden";
    body.style.height="0px";
    body.style.transition="none";
    body.getBoundingClientRect();
    body.style.transition="height .18s ease";
    requestAnimationFrame(()=>{ body.style.height=h+"px"; });
    body.addEventListener("transitionend", function te(){
      body.removeEventListener("transitionend", te);
      body.style.cssText="";
    }, {once:true});
  }
});

// Edits a room-label's text directly on the canvas, with a small floating
// input positioned right over the label — no modal/dialog involved.
function editLabelInline(){
  const l=state.labels.find(l=>l.id===selId);if(!l)return;
  const existing=document.getElementById("inlineLabelEdit");if(existing)existing.remove();
  const[sx,sy]=toScreen(l.x,l.y);
  const r=svg.getBoundingClientRect();
  const inp=document.createElement("input");
  inp.id="inlineLabelEdit";
  inp.value=l.text;
  const wPx=Math.max(l.text.length*9+24,70);
  inp.style.cssText=`position:fixed;left:${r.left+sx}px;top:${r.top+sy}px;transform:translate(-50%,-50%);
    width:${wPx}px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:var(--ink);
    background:var(--surface);border:2px solid var(--accent);border-radius:6px;padding:3px 8px;
    z-index:9999;text-align:center;outline:none;box-shadow:0 4px 14px rgba(0,0,0,.18);`;
  document.body.appendChild(inp);
  inp.focus();inp.select();
  let done=false;
  const commit=()=>{
    if(done)return;done=true;activeInlineEdit=null;
    const v=inp.value.trim();
    if(v && v!==l.text){saveState();l.text=v;}
    inp.remove();render();
  };
  const cancel=()=>{if(done)return;done=true;activeInlineEdit=null;inp.remove();};
  inp.addEventListener("input",()=>{inp.style.width=Math.max(inp.value.length*9+24,70)+"px";});
  inp.addEventListener("keydown",e=>{
    e.stopPropagation();
    if(e.key==="Enter"){e.preventDefault();commit();}
    else if(e.key==="Escape"){e.preventDefault();cancel();}
  });
  inp.addEventListener("blur",commit);
  activeInlineEdit={input:inp,commit,cancel};
}

function snapPanelCenter(wx,wy,typeId,rot){
  const ty=typeOf(typeId);if(!ty)return[snap(wx),snap(wy)];
  const w=(rot%180===0?ty.w:ty.d),h=(rot%180===0?ty.d:ty.w);
  const edgeX=snap(wx-w/2), edgeY=snap(wy-h/2);
  return[edgeX+w/2, edgeY+h/2];
}
function snapToNeighbors(p,cx,cy){
  const d=dims(p);const me={x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h};
  const myXs=[me.x,me.x+me.w],myYs=[me.y,me.y+me.h];let bx=null,bdx=TOL,by=null,bdy=TOL;
  state.panels.forEach(o=>{if(o.id===p.id||isFloor2Panel(o))return;const r=rectOf(o);
    [r.x,r.x+r.w].forEach(ox=>myXs.forEach(mx=>{const dd=Math.abs(ox-mx);if(dd<bdx){bdx=dd;bx=cx+(ox-mx);}}));
    [r.y,r.y+r.h].forEach(oy=>myYs.forEach(my=>{const dd=Math.abs(oy-my);if(dd<bdy){bdy=dd;by=cy+(oy-my);}}));});
  return[bx??cx,by??cy];
}

// Snaps a panel's center (cx,cy) to nearby wall-instance edges, mirroring how walls snap to panels.
function snapPanelToWallEdges(p,cx,cy){
  // Build list of rects: panel body + lateral/horizontal walls + lamina at the new position
  const d=dims(p);
  const tmp={...p,cx,cy};
  const lateralRects=panelWallRects(tmp);
  const allRects=[{x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h},...lateralRects];
  const ty=typeOf(tmp.typeId);
  if(ty&&ty.lamina) allRects.push(getLocalSubRect(tmp,ty.lamina.lx,ty.lamina.ly,ty.lamina.lw,ty.lamina.lh));
  let snapDx=null,snapDy=null,bdx=TOL,bdy=TOL;
  state.wallInstances.forEach(wi=>{
    const corners=wallInstanceWorldCorners(wi);if(!corners)return;
    const cxs=corners.map(c=>c[0]),cys=corners.map(c=>c[1]);
    const wallEdgesX=[Math.min(...cxs),Math.max(...cxs)];
    const wallEdgesY=[Math.min(...cys),Math.max(...cys)];
    allRects.forEach(rect=>{
      const myXs=[rect.x,rect.x+rect.w],myYs=[rect.y,rect.y+rect.h];
      wallEdgesX.forEach(we=>myXs.forEach(me=>{
        const dd=Math.abs(we-me);if(dd<bdx){bdx=dd;snapDx=we-me;}
      }));
      wallEdgesY.forEach(we=>myYs.forEach(me=>{
        const dd=Math.abs(we-me);if(dd<bdy){bdy=dd;snapDy=we-me;}
      }));
    });
  });
  return[snapDx!==null?cx+snapDx:cx,snapDy!==null?cy+snapDy:cy];
}

// Returns true if moving/placing panel p to (cx,cy) would violate any wall's piso restriction.
function panelWallCompatError(panel,cx,cy){
  const d=dims(panel);
  const r={x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h};
  for(const wi of state.wallInstances){
    const wt=wallTypeOf(wi.wallTypeId);
    if(!wt||!wt.allowedPisoIds||!wt.allowedPisoIds.includes(panel.typeId))continue;
    const a=wallAABB(wi);
    if(a&&rectsOverlap(a,r))return true;
  }
  return false;
}

// Returns true if the panel's lateral/horizontal walls OR lamina at position (cx,cy) would overlap a wall instance.
function panelLateralWallsOverlapWalls(panel,cx,cy){
  const tmp={...panel,cx,cy};
  const rects=panelWallRects(tmp);
  const ty=typeOf(tmp.typeId);
  if(ty&&ty.lamina) rects.push(getLocalSubRect(tmp,ty.lamina.lx,ty.lamina.ly,ty.lamina.lw,ty.lamina.lh));
  return rects.some(wr=>
    state.wallInstances.some(wi=>{const a=wallAABB(wi);return a&&rectsOverlap(wr,a);})
  );
}

// Floor-floor and wall-wall overlap prevention: edges may touch (e.g. snapped flush),
// but the interiors must not overlap. Walls may still sit on top of floors freely.
function rectsOverlap(a,b){
  const eps=1e-3;
  return (a.x < b.x+b.w-eps) && (a.x+a.w > b.x+eps) && (a.y < b.y+b.h-eps) && (a.y+a.h > b.y+eps);
}
// Peças do 2º andar (mezanino/escada) ocupam o mesmo X/Y de um piso do 1º
// andar por baixo delas — de propósito, é assim que elas ficam "em cima" do
// piso. Por isso essa checagem (usada só pra posicionar/mover peças do 1º
// andar) precisa ignorá-las, senão nunca seria possível posicionar/mover um
// piso onde já existe um mezanino/escada acima.
function panelOverlapsAny(cx,cy,d,excludeId){
  const me={x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h};
  return state.panels.some(o=>o.id!==excludeId && !isFloor2Panel(o) && rectsOverlap(me,rectOf(o)));
}
// Two axis-aligned rects "touch" (are directly encostados) when they don't
// overlap but one's edge coincides with the other's edge (within TOL) while
// they overlap along the perpendicular axis — i.e. side-by-side or
// stacked flush, sharing a border segment (not just a corner point).
function rectsTouching(a,b){
  const eps=TOL, ov=1e-3;
  const touchX=(Math.abs((a.x+a.w)-b.x)<eps||Math.abs((b.x+b.w)-a.x)<eps)&&(a.y<b.y+b.h-ov)&&(a.y+a.h>b.y+ov);
  const touchY=(Math.abs((a.y+a.h)-b.y)<eps||Math.abs((b.y+b.h)-a.y)<eps)&&(a.x<b.x+b.w-ov)&&(a.x+a.w>b.x+ov);
  return touchX||touchY;
}
// Retorna o NOME do tipo de piso vizinho se colocar/mover um painel do tipo
// `typeId` para (cx,cy) o deixaria diretamente encostado em outro piso cujo
// tipo foi marcado como incompatível — checa os dois sentidos (o tipo sendo
// posicionado pode listar o vizinho como proibido, ou vice-versa). Retorna
// null se não houver conflito.
function pisoIncompativelVizinho(typeId,cx,cy,d,excludeId){
  const ty=typeOf(typeId);if(!ty)return null;
  const me={x:cx-d.w/2,y:cy-d.h/2,w:d.w,h:d.h};
  for(const o of state.panels){
    if(o.id===excludeId||isFloor2Panel(o))continue;
    const oty=typeOf(o.typeId);if(!oty)continue;
    const proibido=(ty.incompativelComPisoIds||[]).includes(oty.id)||(oty.incompativelComPisoIds||[]).includes(ty.id);
    if(!proibido)continue;
    if(rectsTouching(me,rectOf(o)))return oty.name;
  }
  return null;
}
function wallAABB(inst){
  const corners=wallInstanceWorldCorners(inst);if(!corners)return null;
  const xs=corners.map(c=>c[0]),ys=corners.map(c=>c[1]);
  return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};
}
function panelWallRects(p){
  const ty=typeOf(p.typeId);if(!ty)return[];
  const r=rectOf(p);
  const le=lateralEdges(p.rot);const w=p.walls||{l:"solid",r:"solid"};
  const rects=[];
  [["l",le.l],["r",le.r]].forEach(([key,edge])=>{
    const v=w[key];if(v==="solid"||v==="window"){const er=edgeRect(edge,r);rects.push(er);}
  });
  if(ty.hwall){const ir=internalWallRect(p);if(ir)rects.push(ir);}
  if(isMez(ty)){const mr=mezWallRect(p);if(mr)rects.push(mr);}
  return rects;
}
function wallOverlapsAny(inst,excludeId){
  const a=wallAABB(inst);if(!a)return false;
  const hitsWall = state.wallInstances.some(o=>{
    if(o.id===excludeId)return false;
    const b=wallAABB(o);return b&&rectsOverlap(a,b);
  });
  if(hitsWall)return true;
  if(state.panels.some(p=>panelWallRects(p).some(b=>rectsOverlap(a,b))))return true;
  // Block placement over laminas
  return state.panels.some(p=>{
    const ty=typeOf(p.typeId);if(!ty||!ty.lamina)return false;
    const lr=getLocalSubRect(p,ty.lamina.lx,ty.lamina.ly,ty.lamina.lw,ty.lamina.lh);
    return rectsOverlap(a,lr);
  });
}
// Returns true when inst overlaps any lamina (used to colour the ghost red).
function wallGhostOnLamina(inst){
  const a=wallAABB(inst);if(!a)return false;
  return state.panels.some(p=>{
    const ty=typeOf(p.typeId);if(!ty||!ty.lamina)return false;
    const lr=getLocalSubRect(p,ty.lamina.lx,ty.lamina.ly,ty.lamina.lw,ty.lamina.lh);
    return rectsOverlap(a,lr);
  });
}

function placeAt(wx,wy){
  const ty=typeOf(armedType);if(!ty)return;

  if(state.floorMode==='andar2'){
    // 2º andar: só mezanino/escada, com snap próprio (centro do piso do 1º
    // andar + parede do mezanino encostada na parede horizontal do piso).
    if(!isFloor2Type(ty)){toastError("No 2º andar só é possível posicionar mezaninos e escadas.");return;}
    let[cx,cy]=snapAndar2Center(wx,wy,armedType,ghostRot);
    const tmp={id:"_",typeId:armedType,rot:ghostRot,cx,cy};
    if(floor2OverlapsAny(cx,cy,dims(tmp),null)){toastError("Não é possível sobrepor peças do 2º andar.");return;}
    saveState();
    const dw=ty.defaultWalls||{l:"solid",r:"solid"};
    state.panels.push({id:uid(),typeId:armedType,cx,cy,rot:ghostRot,
      walls:{l:dw.l||"solid",r:dw.r||"solid"},corners:{tl:false,tr:false,bl:false,br:false},
      name:{text:ty.name,dx:0,dy:0,show:false},
      oitaoAtivo:!!(ty.possuiPossibilidadeOitao&&ty.oitaoDefaultAtivo),
      patamarLen:(ty.isStair&&ty.patamar)?(ty.patamarComprimento||0.9):undefined});
    renderTabs();renderInv();render();
    return;
  }

  let[cx,cy]=snapPanelCenter(wx,wy,armedType,ghostRot);
  const tmp={id:"_",typeId:armedType,rot:ghostRot,cx,cy};
  // Face externa de outro piso tem prioridade sobre paredes:
  // aplica snap de vizinhos primeiro e só usa snap de parede
  // nos eixos onde nenhum piso vizinho foi encontrado.
  const[ncx,ncy]=snapToNeighbors(tmp,cx,cy);
  const pSnapX=(ncx!==cx), pSnapY=(ncy!==cy);
  [cx,cy]=[ncx,ncy];
  const[wcx,wcy]=snapPanelToWallEdges({...tmp,cx,cy},cx,cy);
  if(!pSnapX) cx=wcx;
  if(!pSnapY) cy=wcy;
  if(panelOverlapsAny(cx,cy,dims(tmp),null)){toastError("Não é possível sobrepor pisos.");return;}
  const _incompNome=pisoIncompativelVizinho(armedType,cx,cy,dims(tmp),null);
  if(_incompNome){toastError(`Este piso não pode ficar encostado em "${_incompNome}".`);return;}
  if(panelWallCompatError(tmp,cx,cy)){toastError("Este piso não é permitido sob essa parede.");return;}
  if(panelLateralWallsOverlapWalls(tmp,cx,cy)){toastError("Parede lateral conflita com uma parede existente.");return;}
  saveState();
  const dw=ty.defaultWalls||{l:"solid",r:"solid"};
  state.panels.push({id:uid(),typeId:armedType,cx,cy,rot:ghostRot,
    walls:{l:dw.l||"solid",r:dw.r||"solid"},corners:{tl:false,tr:false,bl:false,br:false},
    name:{text:ty.name,dx:0,dy:0,show:false},
    oitaoAtivo:!!(ty.possuiPossibilidadeOitao&&ty.oitaoDefaultAtivo),
    patamarLen:(ty.isStair&&ty.patamar)?(ty.patamarComprimento||0.9):undefined});
  renderTabs();renderInv();render();}

// Returns an error message if the wall is incompatible with the floor restriction, or null if OK.
// When allowedPisoIds is set, those are BLOCKED floor types — the wall cannot touch them.
function wallPisoCompatError(inst){
  const wt=wallTypeOf(inst.wallTypeId);
  if(!wt||!wt.allowedPisoIds||wt.allowedPisoIds.length===0)return null;
  const a=wallAABB(inst);if(!a)return null;
  // Block placement if wall overlaps any floor in the blocked list
  for(const p of state.panels){
    if(isFloor2Panel(p))continue; // paredes são do 1º andar; mezanino/escada não contam aqui
    const r=rectOf(p);
    if(rectsOverlap(a,r)&&wt.allowedPisoIds.includes(p.typeId)){
      const ty=typeOf(p.typeId);
      return `Não permitido sobre "${ty?ty.name:p.typeId}"`;
    }
  }
  return null;
}
function placeWallAt(wx,wy){
  const wt=wallTypeOf(armedWallType);if(!wt)return;
  let ax=snap(wx),ay=snap(wy);
  const tmp={wallTypeId:armedWallType,ax,ay,rot:ghostRot};
  [ax,ay]=snapWallToNeighbors(tmp,ax,ay,null);
  const finalInst={wallTypeId:armedWallType,ax,ay,rot:ghostRot};
  if(wallOverlapsAny(finalInst,null)){toastError("Não é possível sobrepor paredes.");return;}
  const compatErr=wallPisoCompatError(finalInst);
  if(compatErr){toastError(`${compatErr}.`);return;}
  saveState();
  const wt2=wallTypeOf(armedWallType);
  const inst={id:uid(),wallTypeId:armedWallType,ax,ay,rot:ghostRot,
    oitaoAtivo:!!(wt2?.possuiPossibilidadeOitao&&wt2?.oitaoDefaultAtivo)};
  state.wallInstances.push(inst);selId=inst.id;
  renderTabs();renderInv();render();}

function addLabel(wx,wy){openTextModal("Novo rótulo de ambiente","Ambiente",txt=>{
  if(txt&&txt.trim()) {
    saveState(); 
    const l={id:uid(),x:snap(wx),y:snap(wy),text:txt,leaderAnchor:null};
    state.labels.push(l);selId=l.id;
  }
  tool="select";setTool();renderInv();render();},true);}

svg.addEventListener("wheel",ev=>{ev.preventDefault();
  const r=svg.getBoundingClientRect();const mx=ev.clientX-r.left,my=ev.clientY-r.top;
  const wx=(mx-view.tx)/view.scale,wy=(my-view.ty)/view.scale;
  view.scale=Math.max(8,Math.min(400,view.scale*(ev.deltaY<0?1.12:1/1.12)));
  view.tx=mx-wx*view.scale;view.ty=my-wy*view.scale;render();},{passive:false});
function zoomBy(f){const r=svg.getBoundingClientRect();const mx=r.width/2,my=r.height/2;
  const wx=(mx-view.tx)/view.scale,wy=(my-view.ty)/view.scale;
  view.scale=Math.max(8,Math.min(400,view.scale*f));view.tx=mx-wx*view.scale;view.ty=my-wy*view.scale;render();}
document.getElementById("zIn").onclick=()=>zoomBy(1.2);
document.getElementById("zOut").onclick=()=>zoomBy(1/1.2);
document.getElementById("zFit").onclick=fit;
function fit(){const r=svg.getBoundingClientRect();const bb=contentBBox();
  const s=Math.min((r.width-90)/bb.w,(r.height-90)/bb.h);view.scale=Math.max(8,Math.min(400,s));
  view.tx=r.width/2-(bb.x+bb.w/2)*view.scale;view.ty=r.height/2-(bb.y+bb.h/2)*view.scale;render();}

function setTool(){const shown=(tool==="place"||tool==="placewall")?"select":tool;
  document.querySelectorAll(".tool").forEach(b=>b.classList.toggle("active",b.dataset.tool===shown));
  svg.classList.toggle("placing",tool==="place"||tool==="placewall");
  svg.classList.toggle("rubberband", !!(drag && drag.kind==="rubberband"));
  if(tool!=="place")armedType=null;
  if(tool!=="placewall")armedWallType=null;}
document.querySelectorAll(".tool").forEach(b=>b.onclick=()=>{b.blur();tool=b.dataset.tool;if(tool!=="select"){selId=null;selIds=new Set();}dimDraftP1=null;dimDraftP2=null;dimMousePt=null;dimDraftAxis=null;setTool();renderInv();render();});

function rotateSel(){
  const p=state.panels.find(p=>p.id===selId);
  if(p){saveState(); p.rot=(p.rot+90)%360; render(); return;}
  const wi=state.wallInstances.find(w=>w.id===selId);if(!wi)return;
  saveState(); wi.rot=((wi.rot||0)+90)%360; render();
}
function dupSel(){
  // Multi-seleção: duplicar todos
  if(selIds.size > 1){
    saveState();
    const newIds=new Set();
    selIds.forEach(id=>{
      const p=state.panels.find(p=>p.id===id);
      if(p){const n={id:uid(),typeId:p.typeId,cx:p.cx+SNAP*3,cy:p.cy+SNAP*3,rot:p.rot,walls:{...p.walls},corners:{...p.corners},name:{...p.name},oitaoAtivo:p.oitaoAtivo,patamarLen:p.patamarLen};state.panels.push(n);newIds.add(n.id);return;}
      const wi=state.wallInstances.find(w=>w.id===id);
      if(wi){const n={id:uid(),wallTypeId:wi.wallTypeId,ax:wi.ax+0.3,ay:wi.ay+0.3,rot:wi.rot||0,oitaoAtivo:wi.oitaoAtivo,doorOpens:wi.doorOpens,doorHinge:wi.doorHinge};state.wallInstances.push(n);newIds.add(n.id);}
    });
    selIds=newIds; selId=[...newIds][0]||null;
    renderTabs();renderInv();render();
    return;
  }
  const p=state.panels.find(p=>p.id===selId);
  if(p){
    saveState();
    const n={id:uid(),typeId:p.typeId,cx:p.cx+SNAP*3,cy:p.cy+SNAP*3,rot:p.rot,
      walls:{...p.walls},corners:{...p.corners},name:{...p.name},oitaoAtivo:p.oitaoAtivo,patamarLen:p.patamarLen};
    state.panels.push(n);selId=n.id;selIds=new Set([n.id]);renderTabs();renderInv();render();
    return;
  }
  const wi=state.wallInstances.find(w=>w.id===selId);if(!wi)return;
  saveState();
  const n={id:uid(),wallTypeId:wi.wallTypeId,ax:wi.ax+0.3,ay:wi.ay+0.3,rot:wi.rot||0,
    oitaoAtivo:wi.oitaoAtivo,doorOpens:wi.doorOpens,doorHinge:wi.doorHinge};
  state.wallInstances.push(n);selId=n.id;selIds=new Set([n.id]);renderTabs();renderInv();render();
}
function delSel(){
  const toDelete=new Set(selIds);
  if(selId) toDelete.add(selId);
  if(!toDelete.size)return;
  saveState();
  state.panels=state.panels.filter(p=>!toDelete.has(p.id));
  state.labels=state.labels.filter(l=>!toDelete.has(l.id));
  state.wallInstances=state.wallInstances.filter(w=>!toDelete.has(w.id));
  state.manualDims=state.manualDims.filter(d=>!toDelete.has(d.id));
  selId=null; selIds=new Set(); renderTabs();renderInv();render();
}

document.addEventListener("keydown",ev=>{
  if(ev.target.tagName==="INPUT" || ev.target.tagName==="SELECT" || document.getElementById("scrim").classList.contains("show")) return;
  // Sem isso, um painel selecionado no 2D continuava reagindo a atalhos
  // (duplicar, girar, apagar etc.) mesmo com a aba 3D aberta e o 2D fora de
  // vista — os atalhos do editor de planta só fazem sentido com o 2D visível.
  if(state.viewMode==='3d') return;
  
  const isCtrl = ev.ctrlKey || ev.metaKey;

  if(isCtrl && (ev.key === "z" || ev.key === "Z")){
    ev.preventDefault();
    undo();
    return;
  }
  if(isCtrl && (ev.key === "y" || ev.key === "Y")){
    ev.preventDefault();
    redo();
    return;
  }
  if(isCtrl && (ev.key === "c" || ev.key === "C")){
    ev.preventDefault();
    if(selId) {
      const p = state.panels.find(p=>p.id===selId);
      if(p) clipboard = {type: "panel", data: JSON.stringify(p)};
      else {
        const l = state.labels.find(l=>l.id===selId);
        if(l) clipboard = {type: "label", data: JSON.stringify(l)};
        else {
          const wi = state.wallInstances.find(w=>w.id===selId);
          if(wi) clipboard = {type: "wallinst", data: JSON.stringify(wi)};
        }
      }
      toast("Copiado!");
    }
    return;
  }
  if(isCtrl && (ev.key === "v" || ev.key === "V")){
    ev.preventDefault();
    if(clipboard) {
      saveState();
      const obj = JSON.parse(clipboard.data);
      obj.id = uid();
      if(clipboard.type === "panel") {
        obj.cx += SNAP*3;
        obj.cy += SNAP*3;
        state.panels.push(obj);
        clipboard.data = JSON.stringify(obj); 
      } else if(clipboard.type === "label") {
        obj.x += SNAP*3;
        obj.y += SNAP*3;
        state.labels.push(obj);
        clipboard.data = JSON.stringify(obj);
      } else if(clipboard.type === "wallinst") {
        obj.ax += SNAP*3; obj.ay += SNAP*3;
        state.wallInstances.push(obj);
        clipboard.data = JSON.stringify(obj);
      }
      selId = obj.id;
      renderTabs(); renderInv(); render();
      toast("Colado!");
    }
    return;
  }

  if(ev.key==="Escape"){dimDraftP1=null;dimDraftP2=null;dimMousePt=null;dimDraftAxis=null;tool="select";selId=null;selIds=new Set();setTool();renderInv();render();if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();}
  if(ev.key==="r"||ev.key==="R"){if(tool==="place"||tool==="placewall"){ghostRot=(ghostRot+90)%360;render();}else rotateSel();}
  if(ev.key==="d"||ev.key==="D")dupSel();
  if(ev.key==="Delete"||ev.key==="Backspace"){ev.preventDefault();delSel();}
  if(ev.key==="v"||ev.key==="V"){tool="select";setTool();renderInv();render();}
  if(ev.key==="t"||ev.key==="T"){tool="label";selId=null;selIds=new Set();setTool();render();}
  if(ev.key==="c"||ev.key==="C"){tool="dim";selId=null;selIds=new Set();dimDraftP1=null;dimDraftP2=null;dimMousePt=null;dimDraftAxis=null;setTool();render();}
});

const scrim=document.getElementById("scrim"),modalBody=document.getElementById("modalBody");
function closeModal(){
  pmGen++; // cancela qualquer fetch/timer pendente do catálogo de plantas (ver abrirPlantasModelo)
  scrim.classList.remove("show");
  // Só tira a largura extra (q-wide, usada pelo Quantitativo) e o layout
  // fixo (pm-modal, usado pelo Plantas Catálogo) depois que a animação de
  // fechar termina — senão o modal muda de forma no meio do fade-out, em
  // vez de sumir do jeito que apareceu.
  setTimeout(()=>{ modalBody.classList.remove("q-wide"); modalBody.classList.remove("pm-modal"); }, 200);
}
// Espera o restante da animação de abertura do modal (se ainda estiver
// rolando) antes de trocar o conteúdo por algo de tamanho diferente —
// evita o "salto" de tamanho no meio da animação quando os dados chegam
// rápido demais (ex: Supabase respondendo antes dos ~180ms do fade-in).
function aguardarAnimacaoAbrir(startedAt, ms=200){
  const elapsed = performance.now()-startedAt;
  return elapsed>=ms ? Promise.resolve() : new Promise(r=>setTimeout(r, ms-elapsed));
}

// ── Diálogo de escolha da qualidade do modelo 3D (Leve/Detalhado) ──
// Mostrado toda vez que o usuário abre a aba 3D (clique no botão "3D").
// Reaproveita o mesmo overlay genérico do confirmDialog, só com conteúdo
// próprio (duas opções, em vez de confirmar/cancelar).
// Resolve com 'leve', 'detalhado', ou null se o usuário fechar sem escolher.
function promptModelQuality3D(){
  const overlay = document.getElementById('confirmOverlay');
  const body    = document.getElementById('confirmModalBody');
  return new Promise(resolve => {
    body.innerHTML = `
      <h3 data-planta-style="planta-inline-040">Qualidade do modelo 3D</h3>
      <p>Escolha como carregar as texturas nesta visualização.</p>
      <div class="modal-actions" data-planta-style="planta-inline-041">
        <button class="tbtn" id="mq_detalhado" data-planta-style="planta-inline-042">
          <span>🖼️ Modelo Detalhado</span>
          <span data-planta-style="planta-inline-043">texturas em alta resolução</span>
        </button>
        <button class="tbtn" id="mq_leve" data-planta-style="planta-inline-042">
          <span>⚡ Modelo Leve</span>
          <span data-planta-style="planta-inline-043">carrega mais rápido</span>
        </button>
        <button class="tbtn" id="mq_cancelar" data-planta-style="planta-inline-044">Cancelar</button>
      </div>`;
    const fechar = (resultado) => { overlay.classList.remove('show'); resolve(resultado); };
    document.getElementById('mq_detalhado').onclick = () => fechar('detalhado');
    document.getElementById('mq_leve').onclick      = () => fechar('leve');
    document.getElementById('mq_cancelar').onclick  = () => fechar(null);
    overlay.classList.add('show');
  });
}

// ── Diálogo de confirmação dentro do site (substitui window.confirm nativo) ──
// Uso: const ok = await confirmDialog("Mensagem…"); if (!ok) return;
// Aceita opts: { titulo, textoConfirmar, textoCancelar, perigo }
function confirmDialog(mensagem, opts){
  opts = opts || {};
  const overlay = document.getElementById('confirmOverlay');
  const body    = document.getElementById('confirmModalBody');
  return new Promise(resolve => {
    body.innerHTML = `
      <h3 data-planta-style="planta-inline-040">${esc(opts.titulo || 'Confirmar ação')}</h3>
      <p>${esc(mensagem)}</p>
      <div class="modal-actions" data-planta-style="planta-inline-045">
        <button class="tbtn" id="cf_cancelar">${esc(opts.textoCancelar || 'Cancelar')}</button>
        <button class="tbtn ${opts.perigo ? 'del' : 'primary'}" id="cf_confirmar">${esc(opts.textoConfirmar || 'Continuar')}</button>
      </div>`;
    const fechar = (resultado) => { overlay.classList.remove('show'); resolve(resultado); };
    document.getElementById('cf_cancelar').onclick  = () => fechar(false);
    document.getElementById('cf_confirmar').onclick = () => fechar(true);
    overlay.classList.add('show');
  });
}

// Verificação de privilégio Admin (perfil retornado pelo backend)
function isAdmin(){return pricingData?.perfil==="Admin";}

// Guarda de acesso: executa fn() somente se Admin, senão mostra erro discreto
function requireAdmin(fn){
  if(isAdmin()){fn();}
  else{toastError("Esta ação requer perfil Admin.");}
}

let currentEsqData=[], currentEsqQty=0;

function renderEsqSection(){
  const qtyRow=document.getElementById("f_esq_qty_row");if(!qtyRow)return;
  qtyRow.querySelectorAll("button").forEach(b=>{
    b.classList.toggle("primary",+b.dataset.n===currentEsqQty);
    b.onclick=()=>{
      currentEsqQty=+b.dataset.n;
      while(currentEsqData.length<currentEsqQty)currentEsqData.push({x:parseFloat((0.5+currentEsqData.length*1.5).toFixed(2)),w:0.90,type:"janela",opens:"fora",hinge:"esquerda",name:"",showName:true});
      currentEsqData=currentEsqData.slice(0,currentEsqQty);
      renderEsqSection();
    };
  });
  const list=document.getElementById("f_esq_list");if(!list)return;
  const TLABELS={janela:"🪟 Janela",porta_giro:"🚪 Giro",porta_correr:"↔ Correr 2f",porta_correr_1:"↔ Correr 1f",abertura:"▭ Abertura"};
  list.innerHTML=currentEsqData.map((e,i)=>`
    <div data-planta-style="planta-inline-046">
      <div data-planta-style="planta-inline-047">ESQUADRIA ${i+1}</div>
      <div data-planta-style="planta-inline-008">
        ${["janela","porta_giro","porta_correr","porta_correr_1","abertura"].map(t=>`<button type="button" class="tbtn esq-t${e.type===t?' primary':''}" data-i="${i}" data-t="${t}" data-planta-style="planta-inline-009">${TLABELS[t]||t}</button>`).join("")}
      </div>
      <div class="field" data-planta-style="planta-inline-048">
        <label>Nome (aparece na planta)</label>
        <div data-planta-style="planta-inline-011">
          <input class="esq-name" data-i="${i}" data-planta-style="planta-inline-012" placeholder="ex: J1, P1..." value="${esc(e.name||"")}">
          <button type="button" class="mini esq-shname" data-i="${i}" title="Mostrar/ocultar nome na planta" data-planta-style="planta-inline-013">${e.showName!==false?'👁 visível':'🚫 oculto'}</button>
        </div>
      </div>
      <div class="two">
        <div class="field" data-planta-style="planta-inline-049"><label>X início (m)</label>
          <input class="esq-x" data-i="${i}" type="number" step="0.01" value="${e.x.toFixed(2)}"></div>
        <div class="field" data-planta-style="planta-inline-049"><label>Largura (m)</label>
          <input class="esq-w" data-i="${i}" type="number" step="0.01" value="${e.w.toFixed(2)}"></div>
      </div>
      ${e.type==="porta_giro"?`
      <div class="two" data-planta-style="planta-inline-050">
        <div class="field" data-planta-style="planta-inline-049"><label>Abre para</label>
          <div data-planta-style="planta-inline-014">
            <button type="button" class="tbtn esq-op${(e.opens||"fora")==="dentro"?" primary":""}" data-i="${i}" data-op="dentro" data-planta-style="planta-inline-051">Dentro</button>
            <button type="button" class="tbtn esq-op${(e.opens||"fora")==="fora"?" primary":""}" data-i="${i}" data-op="fora" data-planta-style="planta-inline-051">Fora</button>
          </div></div>
        <div class="field" data-planta-style="planta-inline-049"><label>Dobradiça</label>
          <div data-planta-style="planta-inline-014">
            <button type="button" class="tbtn esq-hg${(e.hinge||"esquerda")==="esquerda"?" primary":""}" data-i="${i}" data-hg="esquerda" data-planta-style="planta-inline-051">Esquerda</button>
            <button type="button" class="tbtn esq-hg${(e.hinge||"esquerda")==="direita"?" primary":""}" data-i="${i}" data-hg="direita" data-planta-style="planta-inline-051">Direita</button>
          </div></div>
      </div>`:""}
    </div>`).join("");
  list.querySelectorAll(".esq-t").forEach(b=>b.onclick=()=>{currentEsqData[+b.dataset.i].type=b.dataset.t;renderEsqSection();});
  list.querySelectorAll(".esq-x").forEach(inp=>inp.oninput=()=>{currentEsqData[+inp.dataset.i].x=parseFloat(inp.value)||0;});
  list.querySelectorAll(".esq-w").forEach(inp=>inp.oninput=()=>{currentEsqData[+inp.dataset.i].w=Math.max(0.1,parseFloat(inp.value)||0.9);});
  list.querySelectorAll(".esq-op").forEach(b=>b.onclick=()=>{currentEsqData[+b.dataset.i].opens=b.dataset.op;renderEsqSection();});
  list.querySelectorAll(".esq-hg").forEach(b=>b.onclick=()=>{currentEsqData[+b.dataset.i].hinge=b.dataset.hg;renderEsqSection();});
  list.querySelectorAll(".esq-name").forEach(inp=>inp.oninput=()=>{currentEsqData[+inp.dataset.i].name=inp.value;});
  list.querySelectorAll(".esq-shname").forEach(b=>b.onclick=()=>{const e=currentEsqData[+b.dataset.i];e.showName=!(e.showName!==false);renderEsqSection();});
}

let editingType=null, pickedColor=WOOD_L, typeModalCategory='piso';
let curModel3DGetters=null; // preenchido por wireModel3DSection() em openTypeModal; lido em saveType()
let curStairModel3DGetters=null; // idem, mas para openStairModal/saveStairType()
function openTypeModal(id, forceMez, cloneFrom){
  editingType=id?state.types.find(t=>t.id===id):null;
  const src=(!editingType&&cloneFrom)?state.types.find(t=>t.id===cloneFrom):null;
  const mezDefault = forceMez || (editingType && isMez(editingType)) || (src && isMez(src));
  let t;
  if(editingType) t=editingType;
  else if(src) t={...src, name:"Cópia de "+src.name,
    hwall:src.hwall?JSON.parse(JSON.stringify(src.hwall)):null,
    mezanino:src.mezanino?JSON.parse(JSON.stringify(src.mezanino)):null,
    lamina:src.lamina?JSON.parse(JSON.stringify(src.lamina)):null};
  else t=mezDefault?{name:"",w:2.40,d:1.85,color:WOOD_L,tabIds:["geral"]}:{name:"",w:4.50,d:1.50,color:WOOD_L,tabIds:["geral"]};
  pickedColor=t.color || WOOD_L;
  typeModalCategory = mezDefault ? 'mezanino' : 'piso';
  currentEsqData=JSON.parse(JSON.stringify((t.hwall&&t.hwall.esquadrias)||(t.mezanino&&t.mezanino.esquadrias)||[]));
  currentEsqQty=currentEsqData.length;
  const titleStr = id ? "Editar piso" : src ? `Duplicar: ${esc(src.name)}` : "Novo tipo de piso";
  
  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML=`<h3>${titleStr}</h3>

    <!-- Exibir nas abas (sempre visível) -->
    <div class="field" data-planta-style="planta-inline-020"><label>Exibir nas abas:</label>
      <div data-planta-style="planta-inline-052">
        ${(state.tabs||[{id:'geral',name:'Geral'}]).map(tab=>`
          <label data-planta-style="planta-inline-053">
            <input type="checkbox" class="tab-cb" value="${tab.id}" ${t.tabIds.includes(tab.id)?'checked':''} ${tab.id==='geral'?'disabled checked':''} data-planta-style="planta-inline-023">
            ${esc(tab.name)}
          </label>`).join("")}
      </div>
    </div>

    <!-- Categoria 1: Informações básicas (aberta) -->
    <details class="tm-section" open>
      <summary>📐 Informações Básicas</summary>
      <div class="tm-body">
        <div class="field"><label>Nome / código</label><input id="f_name" value="${esc(t.name)}" placeholder="ex: Piso 4,5 × 1,5"></div>
        <div class="field"><label>Categoria do piso</label>
          <div data-planta-style="planta-inline-054">
            <button type="button" class="tbtn" id="f_cat_piso" data-planta-style="planta-inline-012">Piso normal</button>
            <button type="button" class="tbtn" id="f_cat_mez" data-planta-style="planta-inline-012">🏗 Mezanino</button>
          </div>
        </div>
        <p class="sub" id="f_dims_hint" data-planta-style="planta-inline-055">Dimensões do módulo de piso, em metros.</p>
        <p class="sub" id="f_mez_hint" data-planta-style="planta-inline-056">Medidas da área do mezanino.</p>
        <div class="two">
          <div class="field"><label id="f_w_label">Largura (m)</label><input id="f_w" type="number" step="0.01" value="${t.w}"></div>
          <div class="field"><label id="f_d_label">Comprimento (m)</label><input id="f_d" type="number" step="0.01" value="${t.d}"></div>
        </div>
        <div id="f_color_box" class="field" data-planta-display="${t.hwall ? 'hidden' : 'visible'}">
          <label>Cor do Piso</label>
          <div class="swatches" id="f_sw">
            <div class="sw ${pickedColor===WOOD_L?'on':''}" data-c="${WOOD_L}" data-planta-wood="light" title="Marrom Claro"></div>
            <div class="sw ${pickedColor===WOOD_D?'on':''}" data-c="${WOOD_D}" data-planta-wood="dark" title="Marrom Escuro"></div>
          </div>
        </div>
        <div class="field" data-planta-style="planta-inline-018">
          <label>Espessura lateral (m)</label>
          <input id="f_wallthick" type="number" step="0.005" min="0.05" max="0.30" value="${(t.wallThick||0.10).toFixed(3)}">
        </div>
      </div>
    </details>

    <!-- Categoria 2: Predefinições de modelo (fechada) -->
    <details class="tm-section">
      <summary>⚙ Predefinições de Modelo</summary>
      <div class="tm-body">
        <div class="field">
          <label>Rotação inicial ao posicionar</label>
          <div data-planta-style="planta-inline-025">
            <button type="button" class="tbtn" id="f_rot_btn" data-planta-style="planta-inline-026">↻ <span id="f_rot_val">0°</span></button>
            <span class="sub" data-planta-style="planta-inline-027">Toda vez que você for posicionar este piso, ele já começa girado assim.</span>
          </div>
        </div>
        <div class="field">
          <label>Paredes laterais padrão</label>
          <div class="two">
            <button type="button" class="tbtn" id="f_dwall_l" data-planta-style="planta-inline-012">Esq: —</button>
            <button type="button" class="tbtn" id="f_dwall_r" data-planta-style="planta-inline-012">Dir: —</button>
          </div>
          <p class="sub" data-planta-style="planta-inline-004">Define como as paredes laterais já começam ao posicionar este modelo.</p>
        </div>
        <div class="field" data-planta-style="planta-inline-018"><label data-planta-style="planta-inline-034">
          <input type="checkbox" id="f_wlock" data-planta-style="planta-inline-030" ${t.lockWalls?"checked":""}> 🔒 Bloquear edição das paredes laterais para este modelo</label></div>
      </div>
    </details>

    <!-- Categoria 3: Opcionais (fechada) -->
    <details class="tm-section">
      <summary>✨ Opcionais</summary>
      <div class="tm-body">

        <!-- Sub-accordion: Parede interna horizontal -->
        <details class="tm-section" id="f_hw_section" ${t.hwall?"open":""}>
          <summary>🧱 Parede interna horizontal</summary>
          <div class="tm-body">
            <div class="field" id="f_hw_row" data-planta-style="planta-inline-018"><label data-planta-style="planta-inline-034">
              <input type="checkbox" id="f_hw" data-planta-style="planta-inline-030" ${t.hwall?"checked":""}> Ativar parede interna horizontal</label></div>
            <div id="f_hwbox" data-planta-display="${t.hwall ? 'visible' : 'hidden'}" data-planta-style="planta-dynamic-panel">
              <div class="two"><div class="field" data-planta-style="planta-inline-010"><label>Espessura (m)</label><input id="f_hth" type="number" step="0.01" value="${t.hwall?t.hwall.th:0.12}"></div>
                <div class="field" data-planta-style="planta-inline-010"><label>Afast. deck (m)</label><input id="f_hdeck" type="number" step="0.01" value="${t.hwall?t.hwall.deck:0.20}"></div>
              </div>
              <p class="sub" data-planta-style="planta-inline-057">Extensão horizontal — 0 = borda esquerda.</p>
              <div class="two">
                <div class="field" data-planta-style="planta-inline-010"><label>X início (m)</label><input id="f_hx0" type="number" step="0.01" min="0" value="${t.hwall?(t.hwall.x0!==undefined?t.hwall.x0:0).toFixed(2):'0.00'}"></div>
                <div class="field" data-planta-style="planta-inline-010"><label>X fim (m)</label><input id="f_hx1" type="number" step="0.01" min="0" value="${t.hwall?(t.hwall.x1!==undefined?t.hwall.x1:t.w).toFixed(2):t.w.toFixed(2)}"></div>
              </div>
              <div class="field" data-planta-style="planta-inline-010"><label data-planta-style="planta-inline-034">
                <input type="checkbox" id="f_twotone" data-planta-style="planta-inline-030" ${(!t.hwall||t.hwall.twoTone!==false)?"checked":""}> Dois tons (marrom claro + escuro)</label></div>
            </div>
            <div id="f_esqwrap" data-planta-display="${t.hwall ? 'visible' : 'hidden'}" data-planta-style="planta-dynamic-panel">
              <label data-planta-style="planta-inline-058">Esquadrias na parede</label>
              <div data-planta-style="planta-inline-059" id="f_esq_qty_row">
                ${[0,1,2,3,4].map(n=>'<button type="button" class="tbtn" data-n="'+n+'" data-planta-style="planta-inline-060">'+(n===0?"Nenhuma":n)+'</button>').join("")}
              </div>
              <div id="f_esq_list"></div>
            </div>
          </div>
        </details>

        <!-- Sub-accordion: Lâmina -->
        <details class="tm-section" id="f_lam_section" ${t.lamina?"open":""}>
          <summary>⬜ Lâmina (quadrado branco)</summary>
          <div class="tm-body">
            <div class="field" id="f_lam_row" data-planta-style="planta-inline-018"><label data-planta-style="planta-inline-034">
              <input type="checkbox" id="f_lam" data-planta-style="planta-inline-030" ${t.lamina?"checked":""}> Ativar lâmina</label></div>
            <div id="f_lambox" data-planta-display="${t.lamina ? 'visible' : 'hidden'}" data-planta-style="planta-dynamic-panel">
              <p class="sub" data-planta-style="planta-inline-061">Coordenadas a partir da borda inferior-esquerda (Y cresce para cima).</p>
              <div class="two">
                <div class="field" data-planta-style="planta-inline-010"><label>X início (m)</label><input id="f_lx1" type="number" step="0.01" value="${t.lamina?(t.lamina.lx+(t.w/2)).toFixed(3):0}"></div>
                <div class="field" data-planta-style="planta-inline-010"><label>X fim (m)</label><input id="f_lx2" type="number" step="0.01" value="${t.lamina?(t.lamina.lx+t.lamina.lw+(t.w/2)).toFixed(3):t.w}"></div>
              </div>
              <div class="two">
                <div class="field" data-planta-style="planta-inline-010"><label>Y início / baixo (m)</label><input id="f_ly1" type="number" step="0.001" value="${t.lamina?(t.d/2-t.lamina.ly-t.lamina.lh).toFixed(3):0}"></div>
                <div class="field" data-planta-style="planta-inline-010"><label>Y fim / cima (m)</label><input id="f_ly2" type="number" step="0.001" value="${t.lamina?(t.d/2-t.lamina.ly).toFixed(3):t.d}"></div>
              </div>
            </div>
          </div>
        </details>

        <!-- Sub-accordion: Rede -->
        <details class="tm-section" id="f_rede_section_wrap" data-planta-style="planta-inline-062" ${t.rede?"open":""}>
          <summary>⬚ Área de Rede / Trama</summary>
          <div class="tm-body">
            <div class="field" id="f_rede_row" data-planta-style="planta-inline-018"><label data-planta-style="planta-inline-034">
              <input type="checkbox" id="f_rede_chk" data-planta-style="planta-inline-030" ${t.rede?"checked":""}> ⬚ Ativar área de rede / trama</label></div>
            <div id="f_rede_section" class="rede-section" data-planta-display="${t.rede ? 'visible' : 'hidden'}">
              <p class="sub" data-planta-style="planta-inline-063">Coordenadas a partir da borda esquerda/inferior do piso.</p>
              <div class="two">
                <div class="field" data-planta-style="planta-inline-010"><label>X início (m)</label><input id="f_rede_x0" type="number" step="0.01" min="0" value="${(t.rede&&t.rede.x0)||0}"></div>
                <div class="field" data-planta-style="planta-inline-010"><label>X fim (m)</label><input id="f_rede_x1" type="number" step="0.01" min="0" value="${(t.rede&&t.rede.x1)||0}"></div>
              </div>
              <div class="two">
                <div class="field" data-planta-style="planta-inline-010"><label>Y início / baixo (m)</label><input id="f_rede_y0" type="number" step="0.01" min="0" value="${(t.rede&&t.rede.y0)||0}"></div>
                <div class="field" data-planta-style="planta-inline-010"><label>Y fim / cima (m)</label><input id="f_rede_y1" type="number" step="0.01" min="0" value="${(t.rede&&t.rede.y1)||0}"></div>
              </div>
            </div>
          </div>
        </details>

        <!-- Sub-accordion: Oitão -->
        <details class="tm-section" id="f_oitao_section" data-planta-style="planta-inline-062" ${t.possuiPossibilidadeOitao?"open":""}>
          <summary>△ Possibilidade de Oitão</summary>
          <div class="tm-body">
            <div class="field" id="f_oitao_row" data-planta-style="planta-inline-018"><label data-planta-style="planta-inline-034">
              <input type="checkbox" id="f_oitao_chk" data-planta-style="planta-inline-030" ${t.possuiPossibilidadeOitao?"checked":""}> △ Ativar possibilidade de oitão</label></div>
            <div class="field" id="f_oitao_nome_row" data-planta-display="${t.possuiPossibilidadeOitao ? 'visible' : 'hidden'}" data-planta-style="planta-dynamic-margin-bottom">
              <label>Nome do Oitão <span data-planta-style="planta-inline-035">(label visual no SVG)</span></label>
              <input id="f_oitao_nome" value="${esc(t.nomeOitao||"")}" placeholder="Ex: Oitão A-Frame">
              <label data-planta-style="planta-inline-036">
                <input type="checkbox" id="f_oitao_default" data-planta-style="planta-inline-030" ${t.oitaoDefaultAtivo?"checked":""}> Ativado por padrão ao posicionar
              </label>
            </div>
          </div>
        </details>

        <!-- Sub-accordion: Incompatibilidade com outros pisos -->
        <details class="tm-section" id="f_incompat_section" data-planta-style="planta-inline-062" ${(t.incompativelComPisoIds&&t.incompativelComPisoIds.length)?"open":""}>
          <summary>🚫 Não pode encostar em outro piso</summary>
          <div class="tm-body">
            <p class="sub" data-planta-style="planta-inline-024">Marque os tipos de piso que este tipo NÃO pode ficar diretamente encostado (lateral a lateral). Ao tentar posicionar ou mover encostando um nesse outro, um aviso será mostrado e o encaixe será bloqueado.</p>
            <div data-planta-style="planta-inline-064">
              ${state.types.filter(tp=>!isMez(tp)&&tp.id!==t.id).map(tp=>'<label data-planta-style="planta-inline-065"><input type="checkbox" class="f-incompat-cb" value="'+tp.id+'" '+((t.incompativelComPisoIds||[]).includes(tp.id)?'checked':'')+' data-planta-style="planta-inline-030"> '+esc(tp.name)+'</label>').join('') || '<span class="sub" data-planta-style="planta-inline-066">Nenhum outro tipo de piso cadastrado ainda.</span>'}
            </div>
          </div>
        </details>

        <!-- Sub-accordion: Janela lateral centralizada -->
        <details class="tm-section" ${(t.lateralEsq&&t.lateralEsq.enabled)?"open":""}>
          <summary>🪟 Janela Lateral Centralizada (45 cm)</summary>
          <div class="tm-body">
            <div class="field" data-planta-style="planta-inline-018">
              <label data-planta-style="planta-inline-067">
                <input type="checkbox" id="f_latesq" data-planta-style="planta-inline-030" ${(t.lateralEsq&&t.lateralEsq.enabled)?"checked":""}> Ativar janela lateral centralizada</label>
              <div id="f_latesqside" data-planta-display="${(t.lateralEsq&&t.lateralEsq.enabled) ? 'flex' : 'hidden'}" data-planta-style="planta-dynamic-lateral-gap">
                <label data-planta-style="planta-inline-068"><input type="radio" name="latesqside" value="esq" ${(t.lateralEsq&&t.lateralEsq.side==='esq')?"checked":""} data-planta-style="planta-inline-030"> Esquerda</label>
                <label data-planta-style="planta-inline-068"><input type="radio" name="latesqside" value="dir" ${(t.lateralEsq&&t.lateralEsq.side==='dir')?"checked":""} data-planta-style="planta-inline-030"> Direita</label>
                <label data-planta-style="planta-inline-068"><input type="radio" name="latesqside" value="ambas" ${(!t.lateralEsq||!t.lateralEsq.side||t.lateralEsq.side==='ambas')?"checked":""} data-planta-style="planta-inline-030"> Ambas</label>
              </div>
            </div>
          </div>
        </details>

      </div>
    </details>

    ${renderModel3DSectionHTML('f', t)}

    <!-- BOM como accordion colapsado -->
    <details class="tm-section">
      <summary><span class="bom-title" data-planta-style="planta-inline-015">📦 Composição Real (BOM)
        <span data-planta-style="planta-inline-016" data-planta-stop-propagation="true">
          <button type="button" class="tbtn" id="f_bom_copy" data-planta-style="planta-inline-017" title="Copiar BOM deste painel">📋 Copiar</button>
          <button type="button" class="tbtn" id="f_bom_paste" data-planta-style="planta-inline-017" title="Colar BOM copiado">📌 Colar</button>
        </span>
      </span></summary>
      <div class="tm-body">
        <div data-planta-style="planta-inline-037">
          <button type="button" class="tbtn" id="f_bom_add" data-planta-style="planta-inline-017">+ Produto</button>
        </div>
        <div id="f_bom_list"></div>
        <p class="sub" data-planta-style="planta-inline-038">Se vazio, o quantitativo usa o nome do painel como produto. Condições lidas no momento do cálculo.</p>
      </div>
    </details>

    <div class="modal-actions">${id?'<button class="del-link" id="f_del">Excluir tipo</button>':''}
      <button class="tbtn" id="f_cancel">Cancelar</button><button class="tbtn primary" id="f_save">Salvar</button></div>`;
      
  modalBody.querySelectorAll(".sw").forEach(s=>s.onclick=()=>{
    pickedColor=s.dataset.c;
    modalBody.querySelectorAll(".sw").forEach(x=>x.classList.toggle("on",x===s));
  });

  const hwChk=document.getElementById("f_hw");
  const paintCategory=()=>{
    const mez = typeModalCategory==='mezanino';
    document.getElementById("f_cat_piso").classList.toggle("primary",!mez);
    document.getElementById("f_cat_mez").classList.toggle("primary",mez);
    document.getElementById("f_w_label").textContent = mez ? "Largura (m) — área marrom" : "Largura (m)";
    document.getElementById("f_d_label").textContent = mez ? "Comprimento (m) — área marrom" : "Comprimento (m)";
    document.getElementById("f_dims_hint").style.display = mez ? "none" : "";
    document.getElementById("f_mez_hint").style.display = mez ? "" : "none";
    document.getElementById("f_color_box").style.display = mez ? "none" : (hwChk.checked?"none":"");
    const hwSec=document.getElementById("f_hw_section");
    if(hwSec) hwSec.style.display = mez ? "none" : "";
    document.getElementById("f_hwbox").style.display = (!mez && hwChk.checked) ? "" : "none";
    document.getElementById("f_esqwrap").style.display = (!mez && hwChk.checked) ? "" : "none";
    const lamSec=document.getElementById("f_lam_section");
    if(lamSec) lamSec.style.display = mez ? "none" : "";
    document.getElementById("f_lambox").style.display = (!mez && document.getElementById("f_lam").checked) ? "" : "none";
  };
  document.getElementById("f_cat_piso").onclick=()=>{typeModalCategory='piso';paintCategory();};
  document.getElementById("f_cat_mez").onclick=()=>{typeModalCategory='mezanino';paintCategory();};

  // Rede section: só para piso, com colapso por checkbox
  const updateRedeVis=()=>{
    const isPiso=typeModalCategory==='piso';
    const wrap=document.getElementById("f_rede_section_wrap");
    const sec=document.getElementById("f_rede_section");
    const chk=document.getElementById("f_rede_chk");
    if(wrap) wrap.style.display=isPiso?"":"none";
    if(sec) sec.style.display=(isPiso&&chk&&chk.checked)?"":"none";
  };
  document.getElementById("f_cat_piso").onclick=()=>{typeModalCategory='piso';paintCategory();updateRedeVis();};
  document.getElementById("f_cat_mez").onclick=()=>{typeModalCategory='mezanino';paintCategory();updateRedeVis();};
  updateRedeVis();
  // Wire checkbox
  const redeChkEl=document.getElementById("f_rede_chk");
  if(redeChkEl) redeChkEl.onchange=updateRedeVis;

  // Oitão: visível apenas para piso; nome só aparece quando checkbox marcado
  const updateOitaoVis=()=>{
    const isPiso=typeModalCategory==='piso';
    const oSection=document.getElementById("f_oitao_section");
    const oNome=document.getElementById("f_oitao_nome_row");
    const oChk=document.getElementById("f_oitao_chk");
    if(oSection) oSection.style.display=isPiso?"":"none";
    if(oNome) oNome.style.display=(isPiso&&oChk?.checked)?"":"none";
    // Incompatibilidade entre pisos: mesma visibilidade do oitão (só piso)
    const incompatSection=document.getElementById("f_incompat_section");
    if(incompatSection) incompatSection.style.display=isPiso?"":"none";
  };
  document.getElementById("f_oitao_chk")?.addEventListener("change",updateOitaoVis);
  updateOitaoVis();
  // Reatrelar categoria para também atualizar oitão
  const _pisoBtn=document.getElementById("f_cat_piso");
  const _mezBtn=document.getElementById("f_cat_mez");
  const _origPiso=_pisoBtn.onclick; const _origMez=_mezBtn.onclick;
  _pisoBtn.onclick=()=>{_origPiso?.();updateOitaoVis();};
  _mezBtn.onclick=()=>{_origMez?.();updateOitaoVis();};

  hwChk.onchange=paintCategory;
  const lamChk=document.getElementById("f_lam");
  lamChk.onchange=paintCategory;
  paintCategory();
  renderEsqSection();

  // ── BOM Editor ─────────────────────────────────────────────────────────
  // Condições disponíveis variam conforme a categoria do painel
  function getBomConditions(){
    const isPiso   = typeModalCategory === 'piso';
    const isParede = typeModalCategory === 'parede';
    if (isParede) {
      return [
        {v:"padrao",             l:"Padrão / Sempre"},
        {v:"esq_esquadria_esq",  l:"Se Esquadria = Esquerda"},
        {v:"esq_esquadria_dir",  l:"Se Esquadria = Direita"},
        {v:"oitao_ativo",        l:"Se Oitão Ativo"},
      ];
    }
    // Piso (e mezanino)
    const pisoSpecific = isPiso ? [
      {v:"piso_parede_esq_solida",    l:"Se Parede Esq = Sólida"},
      {v:"piso_parede_esq_aberturas", l:"Se Parede Esq = Aberturas"},
      {v:"piso_parede_dir_solida",    l:"Se Parede Dir = Sólida"},
      {v:"piso_parede_dir_aberturas", l:"Se Parede Dir = Aberturas"},
      {v:"piso_com_quina",            l:"Com recortes de quina (◰ ◳ ◱ ◲)"},
      {v:"oitao_ativo",               l:"Se Oitão Ativo"},
    ] : [];
    return [
      {v:"padrao", l:"Padrão / Sempre"},
      ...pisoSpecific,
    ];
  }
  const prodOptions = (pricingData?.produtos||[])
    .map(p=>`<option value="${esc(p.nome)}">${esc(p.nome)}</option>`).join('');

  let bomRows = JSON.parse(JSON.stringify(t.bomConfig||[]));

  function renderBomList(){
    const list=document.getElementById("f_bom_list");
    if(!list)return;
    list.innerHTML='';
    const condOptions=getBomConditions().map(c=>`<option value="${c.v}">${c.l}</option>`).join('');
    bomRows.forEach((row,i)=>{
      const div=document.createElement('div');div.className='bom-row';
      div.innerHTML=`
        <select class="bom-prod">${prodOptions}</select>
        <select class="bom-cond">${condOptions}</select>
        <input class="bom-qty" type="number" min="0.1" step="0.5" value="${row.qty||1}">
        <button class="bom-del" data-i="${i}" title="Remover">✕</button>`;
      div.querySelector('.bom-prod').value=row.produtoNome||'';
      div.querySelector('.bom-cond').value=row.condicao||'padrao';
      div.querySelector('.bom-prod').onchange=e=>{bomRows[i].produtoNome=e.target.value;};
      div.querySelector('.bom-cond').onchange=e=>{bomRows[i].condicao=e.target.value;};
      div.querySelector('.bom-qty').onchange=e=>{bomRows[i].qty=Math.max(0.1,parseFloat(e.target.value)||1);};
      div.querySelector('.bom-del').onclick=()=>{bomRows.splice(i,1);renderBomList();};
      list.appendChild(div);
    });
  }
  renderBomList();
  document.getElementById("f_bom_add").onclick=()=>{
    const firstProd=(pricingData?.produtos||[])[0]?.nome||'';
    bomRows.push({produtoNome:firstProd,condicao:'padrao',qty:1});
    renderBomList();
  };
  document.getElementById("f_bom_copy").onclick=()=>{
    bomClipboard=JSON.parse(JSON.stringify(bomRows));
    toast("BOM copiado! Cole em outro painel.");
  };
  document.getElementById("f_bom_paste").onclick=()=>{
    if(!bomClipboard){toastError("Nenhum BOM copiado ainda.");return;}
    bomRows=JSON.parse(JSON.stringify(bomClipboard));
    renderBomList();
    toast("BOM colado com sucesso.");
  };

  let curDefaultRot=t.defaultRot||0;
  document.getElementById("f_rot_val").textContent=curDefaultRot+"°";
  document.getElementById("f_rot_btn").onclick=()=>{
    curDefaultRot=(curDefaultRot+90)%360;
    document.getElementById("f_rot_val").textContent=curDefaultRot+"°";
  };

  const dw0=t.defaultWalls||{l:"solid",r:"solid"};
  let curDWallL=dw0.l||"solid", curDWallR=dw0.r||"solid";
  const paintDWalls=()=>{
    document.getElementById("f_dwall_l").textContent="Esq: "+WLAB[curDWallL];
    document.getElementById("f_dwall_r").textContent="Dir: "+WLAB[curDWallR];
  };
  document.getElementById("f_dwall_l").onclick=()=>{curDWallL=WALLCYCLE[(WALLCYCLE.indexOf(curDWallL)+1)%3];paintDWalls();};
  document.getElementById("f_dwall_r").onclick=()=>{curDWallR=WALLCYCLE[(WALLCYCLE.indexOf(curDWallR)+1)%3];paintDWalls();};
  paintDWalls();
  
  document.getElementById("f_cancel").onclick=closeModal;
  document.getElementById("f_save").onclick=()=>saveType({l:curDWallL,r:curDWallR});
  if(id)document.getElementById("f_del").onclick=()=>{
    if(usedCount(id)&&!confirm("Há pisos desse tipo na planta. Excluir o tipo e remover os pisos?"))return;
    state.panels=state.panels.filter(p=>p.typeId!==id);state.types=state.types.filter(t=>t.id!==id);
    closeModal();renderInv();render();};
  // Wire the lateral window checkbox toggle
  const _fle=document.getElementById('f_latesq');
  const _fls=document.getElementById('f_latesqside');
  if(_fle&&_fls){_fle.onchange=()=>{_fls.style.display=_fle.checked?'flex':'none';};}
  curModel3DGetters=wireModel3DSection('f', t);
  scrim.classList.add("show");setTimeout(()=>document.getElementById("f_name").focus(),50);
}

function saveType(defaultWalls){
  const name=document.getElementById("f_name").value.trim()||"Piso";
  const w=Math.max(0.1,parseFloat(document.getElementById("f_w").value)||0.1);
  const d=Math.max(0.1,parseFloat(document.getElementById("f_d").value)||0.1);
  const defaultRot=parseInt(document.getElementById("f_rot_val").textContent,10)||0;
  const isMezCat = typeModalCategory==='mezanino';
  const lockWalls = !!(document.getElementById("f_wlock")&&document.getElementById("f_wlock").checked);
  defaultWalls = defaultWalls || {l:"solid",r:"solid"};
  
  let tabIds = Array.from(document.querySelectorAll('.tab-cb:checked')).map(cb => cb.value);
  if(!tabIds.includes("geral")) tabIds.push("geral");

  let hwall=null, mezanino=null, color=pickedColor;
  if(isMezCat){
    color=WOOD_L;
    mezanino={};
  } else if(document.getElementById("f_hw").checked){
    hwall={th:Math.max(0.02,parseFloat(document.getElementById("f_hth").value)||0.12),
           deck:Math.max(0,parseFloat(document.getElementById("f_hdeck").value)||0)};
    // X start / end (0-based from left edge, clamped to [0, w])
    const hx0raw=parseFloat(document.getElementById("f_hx0").value);
    const hx1raw=parseFloat(document.getElementById("f_hx1").value);
    hwall.x0=Math.max(0,Math.min(isNaN(hx0raw)?0:hx0raw,w));
    hwall.x1=Math.max(0,Math.min(isNaN(hx1raw)?w:hx1raw,w));
    if(hwall.x1<=hwall.x0){alert("X fim deve ser maior que X início da parede.");return;}
    hwall.twoTone=!!(document.getElementById("f_twotone").checked);
    hwall.esquadrias=currentEsqData.slice(0,currentEsqQty);
  }
  let lamina=null;
  if(!isMezCat && document.getElementById("f_lam")&&document.getElementById("f_lam").checked){
    const X1=parseFloat(document.getElementById("f_lx1").value)||0;
    const X2=parseFloat(document.getElementById("f_lx2").value)||0;
    const Y1=parseFloat(document.getElementById("f_ly1").value)||0;
    const Y2=parseFloat(document.getElementById("f_ly2").value)||0;
    const lx=Math.min(X1,X2)-w/2, lw=Math.abs(X2-X1);
    const ly=d/2-Math.max(Y1,Y2),   lh=Math.abs(Y2-Y1);
    if(lw>0&&lh>0)lamina={lx,ly,lw,lh};
  }
  // --- Bloqueio: parede horizontal não pode sobrepor a lâmina ---
  if(hwall && lamina){
    const hx0_local=(hwall.x0!==undefined?hwall.x0:0)-w/2;
    const hx1_local=(hwall.x1!==undefined?hwall.x1:w)-w/2;
    const hy0_local=d/2-hwall.deck-hwall.th;
    const hy1_local=d/2-hwall.deck;
    const xOverlap=hx0_local<lamina.lx+lamina.lw && hx1_local>lamina.lx;
    const yOverlap=hy0_local<lamina.ly+lamina.lh && hy1_local>lamina.ly;
    if(xOverlap&&yOverlap){
      alert("⚠️ A parede horizontal está posicionada sobre a lâmina.\nAjuste X início / X fim ou o afastamento do deck para que não haja sobreposição.");
      return;
    }
  }
  if(editingType)Object.assign(editingType,{name,w,d,color,hwall,mezanino,lamina,defaultRot,defaultWalls,lockWalls,tabIds});
  else state.types.push({id:uid(),name,w,d,color,hwall,mezanino,lamina,defaultRot,defaultWalls,lockWalls,tabIds});
  const wallThick=Math.max(0.05,Math.min(0.30,parseFloat(document.getElementById("f_wallthick").value)||0.10));
  const latesqEnabled=!!(document.getElementById("f_latesq")&&document.getElementById("f_latesq").checked);
  let lateralEsq=null;
  if(latesqEnabled){
    const sideEl=document.querySelector('input[name="latesqside"]:checked');
    const side=sideEl?sideEl.value:"ambas";
    lateralEsq={enabled:true,x0:0.535,x1:0.965,side};
  }
  // Rede parametrizada
  let rede=null;
  if(!isMezCat){
    const redeChk=document.getElementById("f_rede_chk");
    if(redeChk&&redeChk.checked){
      const rx0=parseFloat(document.getElementById("f_rede_x0")?.value)||0;
      const rx1=parseFloat(document.getElementById("f_rede_x1")?.value)||0;
      const ry0=parseFloat(document.getElementById("f_rede_y0")?.value)||0;
      const ry1=parseFloat(document.getElementById("f_rede_y1")?.value)||0;
      if(rx1>rx0&&ry1>ry0) rede={x0:rx0,x1:rx1,y0:ry0,y1:ry1};
    }
  }
  // BOM Config (composição real)
  const bomRows=[];
  document.querySelectorAll("#f_bom_list .bom-row").forEach(row=>{
    const prod=row.querySelector(".bom-prod")?.value?.trim();
    const cond=row.querySelector(".bom-cond")?.value||"padrao";
    const qty=Math.max(0.1,parseFloat(row.querySelector(".bom-qty")?.value)||1);
    if(prod) bomRows.push({produtoNome:prod,condicao:cond,qty});
  });
  const bomConfig=bomRows.length?bomRows:null;

  // Oitão
  const oitaoChk=document.getElementById("f_oitao_chk");
  const possuiPossibilidadeOitao=!!(oitaoChk&&oitaoChk.checked&&!isMezCat);
  const nomeOitao=possuiPossibilidadeOitao?(document.getElementById("f_oitao_nome")?.value?.trim()||""):"";
  const oitaoDefaultAtivo=possuiPossibilidadeOitao&&!!(document.getElementById("f_oitao_default")?.checked);

  // Incompatibilidade entre pisos: lista de tipos que este piso não pode
  // ficar diretamente encostado (checagem é feita nos dois sentidos, ver
  // pisoIncompativelVizinho).
  const incompativelComPisoIds=isMezCat?[]:Array.from(document.querySelectorAll(".f-incompat-cb:checked")).map(cb=>cb.value);

  // Modelo 3D (peças/.glb por papel, ver wireModel3DSection)
  const model3d=curModel3DGetters?curModel3DGetters.getModel3D():null;

  if(editingType)Object.assign(editingType,{wallThick,lateralEsq,rede,bomConfig,possuiPossibilidadeOitao,nomeOitao,oitaoDefaultAtivo,incompativelComPisoIds,model3d});
  else if(state.types.length>0){const last=state.types[state.types.length-1];Object.assign(last,{wallThick,lateralEsq,rede,bomConfig,possuiPossibilidadeOitao,nomeOitao,oitaoDefaultAtivo,incompativelComPisoIds,model3d});}
  // Manter lista de tipos em ordem alfabética após criar, duplicar ou renomear
  state.types.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));
  closeModal();renderInv();render();
}

// ════════════════════════════════════════════════════════════════════════
// ESCADA — categoria própria (semelhante a Piso / Mezanino / Parede)
// ════════════════════════════════════════════════════════════════════════
let editingStairType=null, stairBomRows=[];
function getStairBomConditions(){
  return [
    {v:"padrao",              l:"Padrão / Sempre"},
    {v:"escada_com_patamar",  l:"Se este modelo TEM patamar"},
    {v:"escada_sem_patamar",  l:"Se este modelo NÃO tem patamar"},
  ];
}
function openStairModal(id, cloneFrom){
  editingStairType = id ? state.types.find(t=>t.id===id) : null;
  const src = (!editingStairType && cloneFrom) ? state.types.find(t=>t.id===cloneFrom) : null;
  let t;
  if(editingStairType) t=editingStairType;
  else if(src) t={...src, name:"Cópia de "+src.name};
  else t={name:"", w:0.80, d:2.40, defaultRot:0, patamar:false, patamarComprimento:0.9, tabIds:["geral"]};

  const titleStr = id ? "Editar escada" : src ? `Duplicar: ${esc(src.name)}` : "Nova escada (Santos Dumont)";
  stairBomRows = JSON.parse(JSON.stringify(t.bomConfig||[]));
  const prodOptions = (pricingData?.produtos||[])
    .map(pr=>`<option value="${esc(pr.nome)}">${esc(pr.nome)}</option>`).join('');
  const condOptions = getStairBomConditions().map(c=>`<option value="${c.v}">${c.l}</option>`).join('');

  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML=`<h3>${titleStr}</h3>

    <!-- Exibir nas abas -->
    <div class="field" data-planta-style="planta-inline-020"><label>Exibir nas abas:</label>
      <div data-planta-style="planta-inline-052">
        ${(state.tabs||[{id:'geral',name:'Geral'}]).map(tab=>`
          <label data-planta-style="planta-inline-053">
            <input type="checkbox" class="tab-cb" value="${tab.id}" ${(t.tabIds||['geral']).includes(tab.id)?'checked':''} ${tab.id==='geral'?'disabled checked':''} data-planta-style="planta-inline-023">
            ${esc(tab.name)}
          </label>`).join("")}
      </div>
    </div>

    <details class="tm-section" open>
      <summary>🪜 Informações Básicas</summary>
      <div class="tm-body">
        <div class="field"><label>Nome do painel</label><input id="fs_name" value="${esc(t.name)}" placeholder="ex: Escada Santos Dumont (Com patamar)"></div>
        <div class="two">
          <div class="field"><label>Largura (m)</label><input id="fs_w" type="number" step="0.01" value="${t.w}"></div>
          <div class="field"><label>Comprimento da corrida — parte "sobe" (m)</label><input id="fs_d" type="number" step="0.01" value="${t.d}"></div>
        </div>
        <p class="sub" data-planta-style="planta-inline-069">O comprimento acima é só o trecho com degraus. O patamar (se houver) é uma medida independente, configurada abaixo — alterá-lo não muda o tamanho da corrida.</p>
        <div class="field">
          <label>Rotação inicial ao posicionar</label>
          <div data-planta-style="planta-inline-025">
            <button type="button" class="tbtn" id="fs_rot_btn" data-planta-style="planta-inline-026">↻ <span id="fs_rot_val">${t.defaultRot||0}°</span></button>
            <span class="sub" data-planta-style="planta-inline-027">Toda vez que você for posicionar esta escada, ela já começa girada assim.</span>
          </div>
        </div>
      </div>
    </details>

    <details class="tm-section" open>
      <summary>🧱 Patamar</summary>
      <div class="tm-body">
        <div class="field" data-planta-style="planta-inline-018">
          <label data-planta-style="planta-inline-034">
            <input type="checkbox" id="fs_patamar_chk" data-planta-style="planta-inline-030" ${t.patamar?"checked":""}> Possui patamar (bloco sólido no topo da escada)
          </label>
        </div>
        <div class="field" id="fs_patamar_len_box" data-planta-display="${t.patamar ? 'visible' : 'hidden'}">
          <label>Comprimento do patamar — padrão (m)</label>
          <input id="fs_patamar_len" type="number" step="0.05" min="0.3" value="${t.patamarComprimento||0.9}">
          <p class="sub" data-planta-style="planta-inline-004">Valor usado ao posicionar uma nova escada deste modelo. Depois de posicionada, o comprimento do patamar pode ser ajustado individualmente pela barra de seleção no canvas.</p>
        </div>
      </div>
    </details>

    <details class="tm-section">
      <summary><span class="bom-title" data-planta-style="planta-inline-015">📦 Composição Real (BOM)
        <span data-planta-style="planta-inline-016" data-planta-stop-propagation="true">
          <button type="button" class="tbtn" id="fs_bom_copy" data-planta-style="planta-inline-017" title="Copiar BOM deste painel">📋 Copiar</button>
          <button type="button" class="tbtn" id="fs_bom_paste" data-planta-style="planta-inline-017" title="Colar BOM copiado">📌 Colar</button>
        </span>
      </span></summary>
      <div class="tm-body">
        <div data-planta-style="planta-inline-037">
          <button type="button" class="tbtn" id="fs_bom_add" data-planta-style="planta-inline-017">+ Produto</button>
        </div>
        <div id="fs_bom_list"></div>
        <p class="sub" data-planta-style="planta-inline-038">Se vazio, o quantitativo usa o nome do painel como produto. Condições lidas no momento do cálculo.</p>
      </div>
    </details>

    ${renderModel3DSectionHTML('f', t)}

    <div class="modal-actions">${id?'<button class="del-link" id="fs_del">Excluir tipo</button>':''}
      <button class="tbtn" id="fs_cancel">Cancelar</button><button class="tbtn primary" id="fs_save">Salvar</button></div>`;

  function renderStairBomList(){
    const list=document.getElementById("fs_bom_list");
    if(!list)return;
    list.innerHTML='';
    stairBomRows.forEach((row,i)=>{
      const div=document.createElement('div');div.className='bom-row';
      div.innerHTML=`
        <select class="bom-prod">${prodOptions}</select>
        <select class="bom-cond">${condOptions}</select>
        <input class="bom-qty" type="number" min="0.1" step="0.5" value="${row.qty||1}">
        <button class="bom-del" data-i="${i}" title="Remover">✕</button>`;
      div.querySelector('.bom-prod').value=row.produtoNome||'';
      div.querySelector('.bom-cond').value=row.condicao||'padrao';
      div.querySelector('.bom-prod').onchange=e=>{stairBomRows[i].produtoNome=e.target.value;};
      div.querySelector('.bom-cond').onchange=e=>{stairBomRows[i].condicao=e.target.value;};
      div.querySelector('.bom-qty').onchange=e=>{stairBomRows[i].qty=Math.max(0.1,parseFloat(e.target.value)||1);};
      div.querySelector('.bom-del').onclick=()=>{stairBomRows.splice(i,1);renderStairBomList();};
      list.appendChild(div);
    });
  }
  renderStairBomList();
  document.getElementById("fs_bom_add").onclick=()=>{
    const firstProd=(pricingData?.produtos||[])[0]?.nome||'';
    stairBomRows.push({produtoNome:firstProd,condicao:'padrao',qty:1});
    renderStairBomList();
  };
  document.getElementById("fs_bom_copy").onclick=()=>{
    bomClipboard=JSON.parse(JSON.stringify(stairBomRows));
    toast("BOM copiado! Cole em outro painel.");
  };
  document.getElementById("fs_bom_paste").onclick=()=>{
    if(!bomClipboard){toastError("Nenhum BOM copiado ainda.");return;}
    stairBomRows=JSON.parse(JSON.stringify(bomClipboard));
    renderStairBomList();
    toast("BOM colado com sucesso.");
  };

  let curStairRot=t.defaultRot||0;
  document.getElementById("fs_rot_btn").onclick=()=>{
    curStairRot=(curStairRot+90)%360;
    document.getElementById("fs_rot_val").textContent=curStairRot+"°";
  };

  document.getElementById("fs_patamar_chk").onchange=e=>{
    document.getElementById("fs_patamar_len_box").style.display=e.target.checked?"":"none";
  };

  curStairModel3DGetters=wireModel3DSection('f', t);

  document.getElementById("fs_cancel").onclick=closeModal;
  document.getElementById("fs_save").onclick=()=>saveStairType(curStairRot);
  if(id) document.getElementById("fs_del").onclick=()=>{
    if(usedCount(id)&&!confirm("Há escadas desse tipo na planta. Excluir o tipo e remover as escadas?"))return;
    state.panels=state.panels.filter(p=>p.typeId!==id);state.types=state.types.filter(t=>t.id!==id);
    closeModal();renderInv();render();
  };

  scrim.classList.add("show");setTimeout(()=>document.getElementById("fs_name").focus(),50);
}

function saveStairType(defaultRot){
  const name=document.getElementById("fs_name").value.trim()||"Escada";
  const w=Math.max(0.3,parseFloat(document.getElementById("fs_w").value)||0.8);
  const d=Math.max(0.5,parseFloat(document.getElementById("fs_d").value)||2.4);
  const patamar=!!document.getElementById("fs_patamar_chk").checked;
  const patamarComprimento=patamar
    ? Math.max(0.3, parseFloat(document.getElementById("fs_patamar_len").value)||0.9)
    : 0;

  let tabIds = Array.from(document.querySelectorAll('.tab-cb:checked')).map(cb => cb.value);
  if(!tabIds.includes("geral")) tabIds.push("geral");

  const bomRows=[];
  document.querySelectorAll("#fs_bom_list .bom-row").forEach(row=>{
    const prod=row.querySelector(".bom-prod")?.value?.trim();
    const cond=row.querySelector(".bom-cond")?.value||"padrao";
    const qty=Math.max(0.1,parseFloat(row.querySelector(".bom-qty")?.value)||1);
    if(prod) bomRows.push({produtoNome:prod,condicao:cond,qty});
  });
  const bomConfig=bomRows.length?bomRows:null;
  const model3d=curStairModel3DGetters?curStairModel3DGetters.getModel3D():null;

  const patch={
    name, w, d, defaultRot, tabIds, bomConfig,
    isStair:true, patamar, patamarComprimento,
    color:"#CFC8B8", hwall:null, mezanino:null, lamina:null,
    defaultWalls:{l:"none",r:"none"}, lockWalls:true,
    wallThick:0.1, lateralEsq:null, rede:null,
    possuiPossibilidadeOitao:false, nomeOitao:"", oitaoDefaultAtivo:false,
    model3d,
  };

  if(editingStairType) Object.assign(editingStairType, patch);
  else state.types.push({id:uid(), ...patch});

  state.types.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));
  closeModal();renderInv();render();
}


function openTextModal(title,initial,cb,multiline){
  const inputHtml=multiline
    ?`<textarea id="t_in" rows="4" data-planta-style="planta-inline-070">${esc(initial)}</textarea><p class="sub" data-planta-style="planta-inline-071">Ctrl+Enter confirma · quebras de linha suportadas</p>`
    :`<input id="t_in" value="${esc(initial)}">`;
  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML=`<h3>${esc(title)}</h3><div class="field"><label>Texto</label>${inputHtml}</div>
    <div class="modal-actions"><button class="tbtn" id="t_cancel">Cancelar</button><button class="tbtn primary" id="t_ok">OK</button></div>`;
  document.getElementById("t_cancel").onclick=()=>{closeModal();cb(null);};
  document.getElementById("t_ok").onclick=()=>{const v=document.getElementById("t_in").value;closeModal();cb(v);};
  scrim.classList.add("show");const i=document.getElementById("t_in");
  setTimeout(()=>{i.focus();if(i.select&&!multiline)i.select();},50);
  i.addEventListener("keydown",e=>{
    if(multiline){if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();document.getElementById("t_ok").click();}}
    else{if(e.key==="Enter"){e.preventDefault();document.getElementById("t_ok").click();}}
  });
}

document.getElementById("projName").addEventListener("input",e=>state.name=e.target.value);
document.getElementById("btnNew").onclick=async()=>{
  if(state.panels.length){
    const ok=await confirmDialog("Começar uma planta nova? As alterações não salvas serão perdidas.", { titulo:"Começar planta nova", textoConfirmar:"Começar nova", perigo:true });
    if(!ok) return;
  }
  state.panels=[];state.labels=[];state.wallInstances=[];state.manualDims=[];state.name="";state.meta={cliente:"",local:"",modelo:"",revisao:"01",projetadoPor:"321 MODULAR",logo:DEFAULT_LOGO};
  historyStack=[];
  document.getElementById("projName").value=state.name;selId=null;
  renderTabs();renderInv();fit();render();};

// O logo padrão é um SVG em base64 relativamente grande (~10KB). Como ele já
// está embutido no próprio app (DEFAULT_LOGO), não faz sentido duplicá-lo
// dentro de todo JSON salvo (planta, Modelo, ou planta pré-definida) — isso
// só infla o arquivo à toa. Omitimos o campo quando é igual ao padrão; ao
// carregar, a ausência do campo já cai de volta no DEFAULT_LOGO. Se algum dia
// existir upload de logo customizado (diferente do padrão), ele continua
// sendo salvo normalmente.
function metaForSave(){
  const m={...state.meta};
  if(!m.logo || m.logo===DEFAULT_LOGO) delete m.logo;
  return m;
}

// render3d: config de EXIBIÇÃO 3D que faz sentido salvar junto do arquivo
// (não é "dado de projeto" como painéis/paredes, mas também não é só uma
// preferência de sessão como sombra/AA/reflexo) — por isso funciona parecido
// com o cadastro de tipos: entra no JSON principal (planta), mas NÃO entra
// no arquivo de "Modelo" (ver serializeModelo, que documenta esse mesmo
// critério pra cadastro de tipos). hdrUrl é o link do ambiente HDR aplicado;
// matPresets/matPresetsLeve são os mapas {nomeDaTextura:{hue,sat,light,rough,metal}}
// do painel "Padrão automático por nome" (🎨) — matPresets guarda os presets
// do modelo Detalhado (mesma chave de sempre, por compatibilidade com
// arquivos salvos antes de existir a distinção Leve/Detalhado — todo preset
// antigo simplesmente "é" um preset do Detalhado) e matPresetsLeve os do
// modelo Leve.
function render3dForSave(){
  const out={};
  if(render3DSettings.hdrUrl) out.hdrUrl=render3DSettings.hdrUrl;
  if(Object.keys(materialPresetsAll3D.detalhado||{}).length) out.matPresets=materialPresetsAll3D.detalhado;
  if(Object.keys(materialPresetsAll3D.leve||{}).length) out.matPresetsLeve=materialPresetsAll3D.leve;
  return out;
}
// Mantém state.render3d sempre espelhando o HDR/presets de textura "ao vivo"
// (render3DSettings.hdrUrl/materialPresets3D) — é state.render3d que
// setViewMode3D lê pra reaplicar automaticamente toda vez que a aba 3D é
// aberta (ver loadRender3dConfig). Chamada depois de QUALQUER mudança nesses
// dois: aplicar/limpar HDR, salvar/remover um padrão de textura, ou importar
// um JSON/Modelo com render3d (nesse caso loadRender3dConfig chama de volta).
function syncStateRender3D(){
  state.render3d=render3dForSave();
}
// Aplica o render3d de um arquivo importado (JSON completo, Modelo, ou
// planta do catálogo) SÓ se o arquivo realmente tinha algo salvo (link de
// HDR e/ou pelo menos um preset de textura). Arquivos/plantas salvos antes
// dessa funcionalidade existir simplesmente não têm esse campo — nesses
// casos, mantém o HDR/presets que já estavam ativos em vez de apagar tudo
// (sem isso, carregar qualquer planta antiga do catálogo "limpava" a
// configuração de exibição 3D atual, obrigando a resalvar cada planta só
// por causa disso). Devolve true se realmente trocou de config.
function applyImportedRender3d(data){
  const r=data&&data.render3d;
  const hasHdr=!!(r&&r.hdrUrl);
  const hasPresets=!!(r&&(
    (r.matPresets&&typeof r.matPresets==='object'&&Object.keys(r.matPresets).length) ||
    (r.matPresetsLeve&&typeof r.matPresetsLeve==='object'&&Object.keys(r.matPresetsLeve).length)
  ));
  if(!hasHdr && !hasPresets) return false;
  state.render3d=r;
  return true;
}
function serialize(){return{v:5,name:state.name,meta:metaForSave(),tabs:state.tabs,activeTab:state.activeTab,types:state.types,panels:state.panels,labels:state.labels,wallTypes:state.wallTypes,wallInstances:state.wallInstances,manualDims:state.manualDims||[],render3d:render3dForSave()};}
function normalizePanel(p){
  const ty=typeOf(p.typeId);
  let walls=p.walls;
  if(!walls||typeof walls.l==="boolean"||typeof walls.t!=="undefined")
    walls={l:(walls&&walls.l)?"solid":"solid",r:(walls&&walls.r)?"solid":"solid"};
  return{id:p.id||uid(),typeId:p.typeId,cx:p.cx,cy:p.cy,rot:p.rot||0,
    walls:{l:walls.l||"solid",r:walls.r||"solid"},
    corners:Object.assign({tl:false,tr:false,bl:false,br:false},p.corners||{}),
    name:Object.assign({text:ty?ty.name:"Piso",dx:0,dy:0,show:false},p.name||{}),
    oitaoAtivo:!!p.oitaoAtivo,
    patamarLen:p.patamarLen};
}
function normalizeWallType(t){
  let length=t.length, thickness=t.thickness;
  if(length===undefined && t.x1!==undefined){
    const spanX=Math.abs((t.x2||0)-(t.x1||0)), spanY=Math.abs((t.y2||0)-(t.y1||0));
    length=Math.max(spanX,spanY); thickness=Math.min(spanX,spanY);
  }
  return{id:t.id||uid(),name:t.name||"Parede",length:length||2.00,thickness:thickness||0.10,
    defaultRot:t.defaultRot||0,tabIds:t.tabIds||[t.tabId||"geral", "geral"],
    door:t.door?{at:t.door.at||0,w:t.door.w||0.8,opens:t.door.opens||"fora",hinge:t.door.hinge||"esquerda",
      name:t.door.name||"",showName:t.door.showName!==false}:null};
}
function normalizeWallInstance(wi){
  return{id:wi.id||uid(),wallTypeId:wi.wallTypeId,ax:wi.ax,ay:wi.ay,rot:wi.rot||0,
    oitaoAtivo:!!wi.oitaoAtivo,
    doorOpens:wi.doorOpens,doorHinge:wi.doorHinge};
}
function load(data){state.name=data.name||"";state.meta=data.meta||{cliente:"",local:"",modelo:"",revisao:"01",projetadoPor:"321 MODULAR",logo:DEFAULT_LOGO};
  if(!state.meta.logo)state.meta.logo=DEFAULT_LOGO;
  state.tabs=data.tabs||[{id:"geral", name:"Geral"}];
  state.activeTab=data.activeTab||state.tabs[0].id;
  state.types=data.types||state.types;
  state.types.forEach(t => { 
    if(t.tabId && !t.tabIds) t.tabIds = [t.tabId, "geral"];
    if(!t.tabIds) t.tabIds = ["geral"];
    if(!t.tabIds.includes("geral")) t.tabIds.push("geral");
  });
  state.panels=(data.panels||[]).map(normalizePanel);
  state.labels=data.labels||[];
  state.wallTypes=(data.wallTypes||state.wallTypes).map(normalizeWallType);
  state.wallTypes.forEach(t => { if(!t.tabIds.includes("geral")) t.tabIds.push("geral"); });
  state.wallInstances=(data.wallInstances||[]).map(normalizeWallInstance);
  state.manualDims=(data.manualDims||[]).map(normalizeManualDim);
  // Config de exibição 3D (HDR + presets de textura por nome — ver
  // render3dForSave/loadRender3dConfig/applyImportedRender3d). Só troca
  // state.render3d se o arquivo importado realmente tinha algo salvo —
  // arquivos mais antigos (de antes dessa funcionalidade existir) não têm
  // esse campo, e nesse caso o HDR/presets já ativos permanecem em vez de
  // serem apagados. state.render3d é o que setViewMode3D lê e reaplica
  // automaticamente toda vez que a aba 3D é aberta (inclusive na primeira
  // vez, e inclusive pro projeto padrão que já vem embutido no app). Se o
  // usuário JÁ estiver olhando pro 3D nesse exato momento, reconstrói a cena
  // agora (pra refletir os novos painéis) e reaplica a config atual na hora;
  // senão, não há pressa — vai ser aplicado sozinho da próxima vez que a aba
  // 3D abrir.
  applyImportedRender3d(data);
  if(state.viewMode==='3d' && sceneReady3D){
    rebuildScene3D(state).then(()=>{
      if(typeof loadRender3dConfig==='function') loadRender3dConfig(state.render3d);
    });
  }
  document.getElementById("projName").value=state.name;selId=null;renderTabs();renderInv();fit();render();}

document.getElementById("btnJson").onclick=()=>{
  const blob=new Blob([JSON.stringify(serialize(),null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download=(state.name||"planta").replace(/[^\w\-]+/g,"_")+".json";a.click();URL.revokeObjectURL(a.href);};
document.getElementById("btnImport").onclick=()=>document.getElementById("fileInput").click();
document.getElementById("fileInput").onchange=e=>{const f=e.target.files[0];if(!f)return;
  const rd=new FileReader();rd.onload=()=>{try{load(JSON.parse(rd.result));}catch(err){alert("Arquivo inválido.");}};
  rd.readAsText(f);e.target.value="";};

// ════════════════════════════════════════════════════════════════════════
// "MODELO" — salva/importa apenas os dados do PROJETO (painéis posicionados,
// cotas, aba ativa e o quantitativo atual: ajustes, itens avulsos, desconto
// e a marcação de insumos "Compra com Indústria"). NÃO inclui o cadastro de
// tipos (state.types / state.wallTypes / state.tabs) — isso é configuração,
// não dado de projeto, e permanece intocado ao importar um Modelo.
// ════════════════════════════════════════════════════════════════════════
function serializeModelo(){
  return{
    kindModelo: "321modular-modelo",
    v: 1,
    name: state.name,
    meta: metaForSave(),
    activeTab: state.activeTab,
    panels: state.panels,
    labels: state.labels,
    wallInstances: state.wallInstances,
    manualDims: state.manualDims||[],
    incluirValorNaPlanta: state.incluirValorNaPlanta!==false,
    insumoCompraIndustria: state.insumoCompraIndustria||{},
    // Quantitativo atual (ajustes manuais de quantidade, itens avulsos, desconto)
    qAjustes: qAjustes,
    qPrecoAjustes: qPrecoAjustes,
    qNovosItens: Array.from(qNovosItens),
    qNovosInsumos: Array.from(qNovosInsumos),
    qDesconto: qDesconto,
    // Config de exibição 3D (HDR + presets de textura por nome — ver
    // render3dForSave/loadRender3dConfig). Ao contrário do cadastro de tipos
    // (state.types/wallTypes/tabs, que fica de fora por ser "configuração do
    // catálogo, não do projeto"), HDR/presets de textura viajam junto com o
    // Modelo — é a forma mais comum de salvar/carregar planta no dia a dia
    // (inclusive via "Plantas Catálogo", que usa este mesmo formato), então
    // ficar de fora aqui fazia essas configurações "sumirem" ao trocar de
    // planta mesmo tendo sido salvas certinho.
    render3d: render3dForSave(),
  };
}
function loadModelo(data){
  state.name=data.name||state.name;
  if(data.meta) state.meta={...state.meta, ...data.meta, logo:(data.meta.logo||state.meta.logo||DEFAULT_LOGO)};
  if(data.activeTab && (state.tabs||[]).some(t=>t.id===data.activeTab)) state.activeTab=data.activeTab;
  state.panels=(data.panels||[]).map(normalizePanel);
  state.labels=data.labels||[];
  state.wallInstances=(data.wallInstances||[]).map(normalizeWallInstance);
  state.manualDims=(data.manualDims||[]).map(normalizeManualDim);
  state.incluirValorNaPlanta=data.incluirValorNaPlanta!==false;
  state.insumoCompraIndustria=data.insumoCompraIndustria||{};
  qAjustes=data.qAjustes||{};
  qPrecoAjustes=data.qPrecoAjustes||{};
  qNovosItens=new Set(data.qNovosItens||[]);
  qNovosInsumos=new Set(data.qNovosInsumos||[]);
  qDesconto=data.qDesconto||{tipo:'percent', valor:0};
  // Mesma lógica do load() da planta (ver applyImportedRender3d): só troca
  // state.render3d se essa planta/Modelo realmente tinha HDR/presets
  // salvos — plantas do catálogo salvas antes dessa funcionalidade existir
  // não têm esse campo, e nesse caso o HDR/presets já ativos permanecem
  // (evita ter que reabrir e resalvar cada planta do catálogo só por causa
  // disso). Só força uma reconstrução imediata se o usuário já estiver
  // olhando pro 3D agora.
  applyImportedRender3d(data);
  if(state.viewMode==='3d' && sceneReady3D){
    rebuildScene3D(state).then(()=>{
      if(typeof loadRender3dConfig==='function') loadRender3dConfig(state.render3d);
    });
  }
  document.getElementById("projName").value=state.name;selId=null;renderTabs();renderInv();fit();render();
  toast("Modelo importado com sucesso.");
}

document.getElementById("btnSaveModelo").onclick=()=>{
  const blob=new Blob([JSON.stringify(serializeModelo(),null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download=(state.name||"modelo").replace(/[^\w\-]+/g,"_")+"_modelo.json";a.click();URL.revokeObjectURL(a.href);};
document.getElementById("btnImportModelo").onclick=()=>document.getElementById("fileInputModelo").click();
document.getElementById("fileInputModelo").onchange=e=>{const f=e.target.files[0];if(!f)return;
  const rd=new FileReader();rd.onload=()=>{try{loadModelo(JSON.parse(rd.result));}catch(err){alert("Arquivo de Modelo inválido.");}};
  rd.readAsText(f);e.target.value="";};

// ════════════════════════════════════════════════════════════════════════
// PLANTAS CATÁLOGO (Ponto 4) — biblioteca de modelos de planta salva
// no servidor (tabela "plantas_predefinidas" do Supabase). Qualquer perfil
// autenticado pode carregar uma; só o Admin pode cadastrar, sobrescrever
// ou excluir. Usa o mesmo formato do "Modelo" (serializeModelo/loadModelo).
// ════════════════════════════════════════════════════════════════════════
document.getElementById("btnPlantasModelo").onclick=abrirPlantasModelo;

// Contador de "geração": cada chamada de abrirPlantasModelo() incrementa este
// id. Os timers/awaits assíncronos abaixo conferem se ainda são a geração
// vigente antes de tocar no DOM — evita que uma resposta atrasada (ou um
// setTimeout do efeito cascata) escreva sobre um modal que já foi fechado
// ou reaberto nesse meio tempo.
let pmGen=0;
// Intervalo entre o início da animação de um card e o do próximo, criando o
// efeito "um modelo por vez" em vez de tudo aparecer de uma só vez.
const PM_STAGGER_MS=90;

async function abrirPlantasModelo(){
  if(!tokenAtivoSessao){ toastError("Aguardando autenticação."); return; }
  const gen=++pmGen;
  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.classList.add("pm-modal");
  // Cabeçalho e rodapé (campo "salvar novo" + Fechar) já entram prontos, no
  // formato final — só a área do meio (.pm-scroll-mid) começa em estado de
  // carregamento e é preenchida depois, modelo por modelo.
  modalBody.innerHTML=`
    <div class="pm-header">
      <h3>📐 Plantas Catálogo</h3>
      <p class="sub">Carregue um modelo de planta pronto sobre o cadastro atual. Isso substitui os painéis, cotas e o quantitativo do projeto aberto.</p>
    </div>
    <div class="pm-scroll-mid">
      <div id="pm_list" data-planta-style="planta-inline-072">Carregando…</div>
    </div>
    <div class="pm-footer">
      <div id="pm_save_area"></div>
      <div class="modal-actions"><button class="tbtn" id="pm_close">Fechar</button></div>
    </div>`;
  document.getElementById("pm_close").onclick=closeModal;
  montarAreaSalvarPlantas(); // não depende dos dados buscados — pode entrar já junto do rodapé
  scrim.classList.add("show");
  const openedAt=performance.now();

  // Só começa a buscar as plantas DEPOIS que a animação de abertura do
  // modal já rodou por completo — o "Carregando…" fica visível durante a
  // abertura, e a requisição em si só dispara com o modal já assentado.
  await aguardarAnimacaoAbrir(openedAt);
  if(gen!==pmGen) return; // modal foi fechado/reaberto enquanto esperava

  let plantas=[], erro=null;
  try{
    const data=await callRPC("listar_plantas", { p_token: tokenAtivoSessao });
    if(!data.ok) throw new Error(data.erro||"Falha ao listar plantas.");
    plantas=(data.plantas||[]).slice().sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR',{sensitivity:'base'}));
  }catch(err){ erro=err; }
  if(gen!==pmGen) return;

  const listEl=document.getElementById("pm_list");
  if(erro){
    listEl.style.cssText="height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 10px";
    listEl.innerHTML=`<p data-planta-style="planta-inline-073">⚠ ${esc(erro.message)}</p>`;
    return;
  }
  if(!plantas.length){
    listEl.style.cssText="height:100%;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 10px";
    listEl.innerHTML=`<p data-planta-style="planta-inline-074">Nenhuma planta cadastrada no catálogo ainda.</p>`;
    return;
  }

  // O estado de carregamento usa um atributo de estilo que define display:flex
  // para centralizar a mensagem. Ele precisa sair quando a lista real e
  // montada; caso contrario os cards ficam em uma unica linha horizontal.
  listEl.removeAttribute("data-planta-style");
  listEl.style.cssText="";
  listEl.innerHTML="";
  // Cada card entra com seu próprio delay de animação (efeito cascata:
  // "um modelo por vez"), em vez de tudo surgir simultaneamente. Como a
  // área do meio já tem altura fixa via CSS, isso não muda o tamanho do
  // modal — só o conteúdo dentro dela.
  plantas.forEach((pl,i)=>{
    const item=document.createElement("div");
    item.className="pm-item";
    item.style.cssText=`display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;margin-bottom:6px;animation-delay:${i*PM_STAGGER_MS}ms`;
    item.innerHTML=`
      <div data-planta-style="planta-inline-012">
        <div data-planta-style="planta-inline-075">${esc(pl.nome)}</div>
      </div>
      <button class="tbtn" data-use="${esc(pl.id)}">Usar</button>
      ${isAdmin()?`<button class="tbtn" data-overwrite="${esc(pl.id)}" data-nome="${esc(pl.nome)}" title="Sobrescrever com o projeto atual">💾 Sobrescrever</button>`:''}
      ${isAdmin()?`<button class="tbtn del" data-remove="${esc(pl.id)}" title="Excluir">🗑</button>`:''}`;
    listEl.appendChild(item);
  });

  listEl.querySelectorAll("[data-use]").forEach(btn=>{
    btn.onclick=async()=>{
      if(state.panels.length){
        const ok=await confirmDialog("Isso vai substituir os painéis, cotas e o quantitativo do projeto atual. Continuar?");
        if(!ok) return;
      }
      btn.disabled=true; btn.textContent="Carregando…";
      try{
        const data=await callRPC("carregar_planta", { p_token: tokenAtivoSessao, p_id: btn.dataset.use });
        if(!data.ok) throw new Error(data.erro||"Falha ao carregar planta.");
        closeModal();
        loadModelo(data.dados);
      }catch(err){
        toastError(err.message); btn.disabled=false; btn.textContent="Usar";
      }
    };
  });
  listEl.querySelectorAll("[data-overwrite]").forEach(btn=>{
    btn.onclick=async()=>{
      const ok=await confirmDialog(
        `Isso vai sobrescrever "${btn.dataset.nome}" com os painéis, cotas e o quantitativo do projeto atual aberto. Essa ação não pode ser desfeita.`,
        { titulo:"Sobrescrever planta do catálogo", textoConfirmar:"Sobrescrever", perigo:true }
      );
      if(!ok) return;
      btn.disabled=true; const textoOriginal=btn.textContent; btn.textContent="Sobrescrevendo…";
      try{
        const data=await callRPC("sobrescrever_planta", { p_token: tokenAtivoSessao, p_id: btn.dataset.overwrite, p_dados: serializeModelo() });
        if(!data.ok) throw new Error(data.erro||"Falha ao sobrescrever planta.");
        toast("Planta sobrescrita com sucesso.");
        abrirPlantasModelo();
      }catch(err){
        toastError(err.message); btn.disabled=false; btn.textContent=textoOriginal;
      }
    };
  });
  listEl.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.onclick=async()=>{
      const ok=await confirmDialog("Excluir esta planta do catálogo? Essa ação não pode ser desfeita.", { titulo:"Excluir planta", textoConfirmar:"Excluir", perigo:true });
      if(!ok) return;
      try{
        const data=await callRPC("excluir_planta", { p_token: tokenAtivoSessao, p_id: btn.dataset.remove });
        if(!data.ok) throw new Error(data.erro||"Falha ao excluir.");
        toast("Planta excluída.");
        abrirPlantasModelo();
      }catch(err){ toastError(err.message); }
    };
  });
}

// Monta o formulário "salvar planta atual como novo modelo" no rodapé fixo,
// visível só para Admin. Não depende da lista de plantas — por isso é
// montado logo na abertura do modal, junto do cabeçalho.
function montarAreaSalvarPlantas(){
  const saveArea=document.getElementById("pm_save_area");
  if(!saveArea || !isAdmin()) return;
  saveArea.innerHTML=`
    <div class="field"><label>Salvar planta atual como novo modelo</label>
      <div data-planta-style="planta-inline-054">
        <input id="pm_nome" placeholder="ex: Kitnet 15m² padrão" data-planta-style="planta-inline-012">
        <button class="tbtn primary" id="pm_salvar">Salvar</button>
      </div>
    </div>
    <p class="sub" data-planta-style="planta-inline-076">Salva os painéis, cotas e quantitativo do projeto aberto agora como uma nova planta no catálogo, disponível para todos.</p>`;
  document.getElementById("pm_salvar").onclick=async()=>{
    const nome=document.getElementById("pm_nome").value.trim();
    if(!nome){ toastError("Dê um nome para a planta."); return; }
    if(!state.panels.length){
      const ok=await confirmDialog("O projeto atual não tem nenhum painel posicionado. Salvar mesmo assim?", { textoConfirmar:"Salvar assim mesmo" });
      if(!ok) return;
    }
    const btn=document.getElementById("pm_salvar");
    btn.disabled=true; btn.textContent="Salvando…";
    try{
      const data=await callRPC("salvar_planta", { p_token: tokenAtivoSessao, p_nome: nome, p_dados: serializeModelo() });
      if(!data.ok) throw new Error(data.erro||"Falha ao salvar planta.");
      toast("Planta salva com sucesso.");
      abrirPlantasModelo();
    }catch(err){
      toastError(err.message); btn.disabled=false; btn.textContent="Salvar";
    }
  };
}

document.getElementById("btnPdf").onclick=openPdfModal;
function openPdfModal(){
  const m=state.meta;
  // Pré-preenche os campos com os dados já salvos em state.meta para persistência
  modalBody.dataset.modal = ""; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML=`<h3>Exportar planta em PDF</h3>
    <div class="field"><label>Nome do cliente</label><input id="m_cli" value="${esc(m.cliente||"")}" placeholder="ex: João Silva"></div>
    <div class="field"><label>Local da obra</label><input id="m_loc" value="${esc(m.local||"")}" placeholder="ex: Rua das Flores, 123 - Cidade/UF"></div>
    <div class="field"><label>Projetado por</label><input id="m_proj" value="${esc(m.projetadoPor||"")}" placeholder="321 MODULAR"></div>
    <div class="two"><div class="field"><label>Modelo / Projeto</label><input id="m_mod" value="${esc(m.modelo||"")}" placeholder="${esc(state.name||"Planta sem título")}"></div>
      <div class="field"><label>Revisão</label><input id="m_rev" value="${esc(m.revisao||"")}" placeholder="01"></div></div>

    <div class="field" data-planta-style="planta-inline-077">
      <label>Cotas no PDF</label>
      <div data-planta-style="planta-inline-054">
        <button type="button" class="tbtn" id="m_dim_auto" data-planta-style="planta-inline-012">Automáticas</button>
        <button type="button" class="tbtn" id="m_dim_manual" data-planta-style="planta-inline-012">Manuais</button>
      </div>
      <p class="sub" data-planta-style="planta-inline-076">Automáticas: só a cota geral do projeto e a do mezanino. Manuais: as cotas que você criou com a ferramenta de cotas na planta.</p>
    </div>

    <div class="field" data-planta-style="planta-inline-077">
      <label data-planta-style="planta-inline-078">
        <input type="checkbox" id="m_incluir_orc" data-planta-style="planta-inline-079">
        Incluir Quantitativo
      </label>
      <p class="sub" data-planta-style="planta-inline-076">Adiciona uma página após a planta com a lista de componentes e o valor total do projeto.</p>
    </div>

    <div class="field" data-planta-style="planta-inline-080">
      <label data-planta-style="planta-inline-078">
        <input type="checkbox" id="m_incluir_blocos" checked data-planta-style="planta-inline-079">
        Gerar planta de blocos
      </label>
      <p class="sub" data-planta-style="planta-inline-076">Gera automaticamente a marcação dos blocos de fundação (15 × 15 cm) sob os pisos, com cotas. Se o Quantitativo também for incluído, ele passa a ficar na página seguinte.</p>
    </div>

    <div class="field" data-planta-style="planta-inline-080">
      <label data-planta-style="planta-inline-078">
        <input type="checkbox" id="m_incluir_valor" ${state.incluirValorNaPlanta!==false?'checked':''} data-planta-style="planta-inline-079">
        Incluir Valor na Planta
      </label>
      <p class="sub" data-planta-style="planta-inline-076">Mostra o valor total do orçamento no carimbo da planta baixa, entre a logo e "Projetado por".</p>
    </div>

    <div class="field" data-planta-style="planta-inline-080">
      <label data-planta-style="planta-inline-078">
        <input type="checkbox" id="m_incluir_labels" checked data-planta-style="planta-inline-079">
        Incluir descrições de esquadrias e oitões
      </label>
      <p class="sub" data-planta-style="planta-inline-076">Exibe os nomes das portas, janelas e indicadores de oitão sobrepostos à planta no PDF.</p>
    </div>

    <div class="modal-actions">
      <button class="tbtn" id="m_cancel">Cancelar</button>
      <button class="tbtn" id="m_preview">Pré-visualizar</button>
      <button class="tbtn accent" id="m_go">Gerar PDF</button>
    </div>`;

  let dimMode = (state.manualDims&&state.manualDims.some(d=>(d.andar||1)===1)) ? "manual" : "auto";
  const paintDimMode=()=>{
    document.getElementById("m_dim_auto").classList.toggle("primary",dimMode==="auto");
    document.getElementById("m_dim_manual").classList.toggle("primary",dimMode==="manual");
  };
  document.getElementById("m_dim_auto").onclick=()=>{dimMode="auto";paintDimMode();};
  document.getElementById("m_dim_manual").onclick=()=>{dimMode="manual";paintDimMode();};
  paintDimMode();

  // Salva os dados em state.meta para que persistam entre aberturas do modal.
  // Chamada tanto ao gerar/pré-visualizar quanto ao cancelar.
  const updateMeta = () => {
    state.meta={
        cliente:     document.getElementById("m_cli").value.trim(),
        local:       document.getElementById("m_loc").value.trim(),
        projetadoPor:document.getElementById("m_proj").value.trim() || "321 MODULAR",
        modelo:      document.getElementById("m_mod").value.trim() || state.name || "Planta sem título",
        revisao:     document.getElementById("m_rev").value.trim() || "01",
        logo: DEFAULT_LOGO
    };
    state.incluirValorNaPlanta = document.getElementById("m_incluir_valor").checked;
  };

  // Cancelar também salva — assim os dados preenchidos não se perdem
  document.getElementById("m_cancel").onclick=()=>{ updateMeta(); closeModal(); };

  document.getElementById("m_preview").onclick=()=>{
      updateMeta();
      const inclOrc    = document.getElementById("m_incluir_orc").checked;
      const inclLabels = document.getElementById("m_incluir_labels").checked;
      const inclBlocos = document.getElementById("m_incluir_blocos").checked;
      closeModal(); generatePDF('preview', dimMode, inclOrc, inclLabels, inclBlocos);
  };

  document.getElementById("m_go").onclick=()=>{
      updateMeta();
      const inclOrc    = document.getElementById("m_incluir_orc").checked;
      const inclLabels = document.getElementById("m_incluir_labels").checked;
      const inclBlocos = document.getElementById("m_incluir_blocos").checked;
      closeModal(); generatePDF('save', dimMode, inclOrc, inclLabels, inclBlocos);
  };

  scrim.classList.add("show");
  setTimeout(()=>document.getElementById("m_cli").focus(),50);
}

// Tick-ended dimension line with extension (witness) lines connecting the
// actual edge being measured to the dimension line itself — usada tanto
// pelas cotas de ambiente/mezanino da planta baixa quanto pela planta de
// blocos (página 2). Opera inteiramente em espaço mm (já convertido pelo
// X()/Y() de quem chama). All cotas render in black by default.
// `side` is "top"/"bottom" (horizontal dim, offset up/down) or
// "left"/"right" (vertical dim, offset left/right) — elementos que
// compartilham a mesma borda recebem o mesmo offset, alinhando suas cotas
// numa única cadeia contínua em vez de cada uma flutuar a uma distância própria.
function roomDimLine(eX1,eY1,eX2,eY2,offset,label,side,color){
  color=color||"#1C1F24";
  let s="";
  if(side==="top"||side==="bottom"){
    const sign=side==="top"?-1:1;
    const dimY=eY1+sign*offset;
    const over=dimY+sign*0.5;
    s+=`<line x1="${eX1.toFixed(2)}" y1="${eY1.toFixed(2)}" x2="${eX1.toFixed(2)}" y2="${over.toFixed(2)}" stroke="${color}" stroke-width="0.1"/>`;
    s+=`<line x1="${eX2.toFixed(2)}" y1="${eY2.toFixed(2)}" x2="${eX2.toFixed(2)}" y2="${over.toFixed(2)}" stroke="${color}" stroke-width="0.1"/>`;
    s+=`<line x1="${eX1.toFixed(2)}" y1="${dimY.toFixed(2)}" x2="${eX2.toFixed(2)}" y2="${dimY.toFixed(2)}" stroke="${color}" stroke-width="0.18"/>`;
    s+=`<line x1="${eX1.toFixed(2)}" y1="${(dimY-0.9).toFixed(2)}" x2="${eX1.toFixed(2)}" y2="${(dimY+0.9).toFixed(2)}" stroke="${color}" stroke-width="0.18"/>`;
    s+=`<line x1="${eX2.toFixed(2)}" y1="${(dimY-0.9).toFixed(2)}" x2="${eX2.toFixed(2)}" y2="${(dimY+0.9).toFixed(2)}" stroke="${color}" stroke-width="0.18"/>`;
    const ty_=side==="top"?dimY-0.7:dimY+2.0;
    s+=`<text x="${((eX1+eX2)/2).toFixed(2)}" y="${ty_.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="2.4" fill="${color}" text-anchor="middle">${esc(label)}</text>`;
  } else {
    const sign=side==="left"?-1:1;
    const dimX=eX1+sign*offset;
    const over=dimX+sign*0.5;
    s+=`<line x1="${eX1.toFixed(2)}" y1="${eY1.toFixed(2)}" x2="${over.toFixed(2)}" y2="${eY1.toFixed(2)}" stroke="${color}" stroke-width="0.1"/>`;
    s+=`<line x1="${eX2.toFixed(2)}" y1="${eY2.toFixed(2)}" x2="${over.toFixed(2)}" y2="${eY2.toFixed(2)}" stroke="${color}" stroke-width="0.1"/>`;
    s+=`<line x1="${dimX.toFixed(2)}" y1="${eY1.toFixed(2)}" x2="${dimX.toFixed(2)}" y2="${eY2.toFixed(2)}" stroke="${color}" stroke-width="0.18"/>`;
    s+=`<line x1="${(dimX-0.9).toFixed(2)}" y1="${eY1.toFixed(2)}" x2="${(dimX+0.9).toFixed(2)}" y2="${eY1.toFixed(2)}" stroke="${color}" stroke-width="0.18"/>`;
    s+=`<line x1="${(dimX-0.9).toFixed(2)}" y1="${eY2.toFixed(2)}" x2="${(dimX+0.9).toFixed(2)}" y2="${eY2.toFixed(2)}" stroke="${color}" stroke-width="0.18"/>`;
    const lx=side==="left"?dimX-0.7:dimX+2.0, ly=(eY1+eY2)/2;
    s+=`<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="2.4" fill="${color}" text-anchor="middle" transform="rotate(-90 ${lx.toFixed(2)} ${ly.toFixed(2)})">${esc(label)}</text>`;
  }
  return s;
}

// ════════════════════════════════════════════════════════════════════════
// PLANTA DE BLOCOS (fundação) — gera automaticamente os pontos de bloco
// (15×15cm) sob os pisos, para uma 2ª página do PDF. Regras:
//  • No sentido do empilhamento dos módulos de piso (sempre a cada 1,50m),
//    um bloco em CADA junção — ou seja, em cada aresta (início/fim) de
//    cada painel de piso naquele sentido.
//  • No sentido da largura própria de cada piso (ty.w, perpendicular ao
//    empilhamento): pisos de 4,5m recebem um bloco em cada lateral + um no
//    centro; pisos mais estreitos (ex: 3m) recebem apenas os das laterais.
//  • Pisos com sentidos diferentes (rotacionados 90°) formam conjuntos
//    ("clusters") independentes — nunca cruzam blocos de um sentido com o
//    outro, mesmo que suas áreas se encostem (ex: junção em L).
// ════════════════════════════════════════════════════════════════════════
const BLOCO_SIZE = 0.15; // 15 x 15 cm
function round3(v){ return Math.round(v*1000)/1000; }
// Pontos de bloco ao longo da largura própria do piso: laterais sempre;
// centro só quando a largura for "grande" (~4,5m). Larguras menores
// (~3m ou abaixo) ficam só com as laterais.
function pisoWidthOffsets(w){
  return w >= 4.0 ? [0, w/2, w] : [0, w];
}
function computeBlocosLayout(){
  const half=BLOCO_SIZE/2;
  const pisoPanels = state.panels.filter(p=>{
    const ty=typeOf(p.typeId);
    return ty && !isMez(ty) && !ty.isStair;
  });
  if(!pisoPanels.length) return { blocks:[], clusters:[] };

  const items = pisoPanels.map(p=>{
    const ty=typeOf(p.typeId);
    const vertical = (((p.rot%360)+360)%360)%180===0;
    return { r:rectOf(p), w:ty.w, vertical };
  });

  // Une painéis de MESMA orientação em um cluster só quando (a) têm a
  // mesma faixa perpendicular ao empilhamento (mesmo x0/x1 se vertical,
  // mesmo y0/y1 se horizontal) E (b) realmente se tocam/sobrepõem no eixo
  // de empilhamento — nunca só por "bater" numericamente numa faixa.
  // Isso evita que dois trechos de piso com a mesma largura mas em lados
  // opostos de outro piso (ex: um "T"/"H") sejam tratados como um cluster
  // só, o que geraria uma cota "ligando" os dois por engano.
  const n=items.length;
  const parent=items.map((_,i)=>i);
  function find(i){ while(parent[i]!==i){ parent[i]=parent[parent[i]]; i=parent[i]; } return i; }
  function union(i,j){ const ri=find(i), rj=find(j); if(ri!==rj) parent[ri]=rj; }
  const TOL=0.06; // tolerância (m) pra considerar "mesma faixa" / "encostando"
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
    if(items[i].vertical!==items[j].vertical) continue;
    const a=items[i].r, b=items[j].r;
    if(items[i].vertical){
      const sameX = Math.abs(a.x-b.x)<=TOL && Math.abs((a.x+a.w)-(b.x+b.w))<=TOL;
      if(!sameX) continue;
      const touchY = a.y <= b.y+b.h+TOL && b.y <= a.y+a.h+TOL;
      if(touchY) union(i,j);
    } else {
      const sameY = Math.abs(a.y-b.y)<=TOL && Math.abs((a.y+a.h)-(b.y+b.h))<=TOL;
      if(!sameY) continue;
      const touchX = a.x <= b.x+b.w+TOL && b.x <= a.x+a.w+TOL;
      if(touchX) union(i,j);
    }
  }
  const groupsByRoot={};
  items.forEach((it,i)=>{
    const root=find(i);
    (groupsByRoot[root]=groupsByRoot[root]||[]).push(it);
  });

  // As linhas de grade (junções/limites) continuam sendo a medida "oficial"
  // (é o que as cotas mostram — aresta a aresta do piso). Só o CENTRO do
  // quadradinho desenhado é que muda: nas pontas (primeira/última posição
  // de cada eixo), o bloco recua meio-lado pra dentro, de forma que sua
  // ARESTA DE FORA — não o centro — fique exatamente sobre o limite do
  // piso. Posições internas (junções entre módulos, e o ponto central da
  // largura) continuam com o bloco centrado exatamente na linha.
  function insetCenters(lines){
    if(lines.length===1) return [lines[0]];
    return lines.map((v,i)=>{
      if(i===0) return round3(v+half);
      if(i===lines.length-1) return round3(v-half);
      return v;
    });
  }

  // Cada cluster grava seus próprios blocos — nunca mesclados com os de
  // outro cluster, mesmo que caiam sobre a mesma coordenada (ex: junção em
  // L/T): pisos de sentidos diferentes (ou clusters distintos do mesmo
  // sentido) não compartilham bloco nem ficam com um bloco sobreposto ao
  // do outro.
  const blocks=[];
  const clusters=[];

  Object.values(groupsByRoot).forEach(group=>{
    const vertical=group[0].vertical, w=group[0].w;
    if(vertical){
      const x0=group[0].r.x;
      const widthLines=pisoWidthOffsets(w).map(v=>round3(x0+v));
      const ys=new Set();
      group.forEach(it=>{ ys.add(round3(it.r.y)); ys.add(round3(it.r.y+it.r.h)); });
      const lengthLines=Array.from(ys).sort((a,b)=>a-b);
      const widthCenters=insetCenters(widthLines);
      const lengthCenters=insetCenters(lengthLines);
      widthCenters.forEach(cx=>lengthCenters.forEach(cy=>blocks.push({x:cx,y:cy})));
      clusters.push({ axis:'v', widthLines, lengthLines, totalW:w });
    } else {
      const y0=group[0].r.y;
      const widthLines=pisoWidthOffsets(w).map(v=>round3(y0+v));
      const xs=new Set();
      group.forEach(it=>{ xs.add(round3(it.r.x)); xs.add(round3(it.r.x+it.r.w)); });
      const lengthLines=Array.from(xs).sort((a,b)=>a-b);
      const widthCenters=insetCenters(widthLines);
      const lengthCenters=insetCenters(lengthLines);
      widthCenters.forEach(cy=>lengthCenters.forEach(cx=>blocks.push({x:cx,y:cy})));
      clusters.push({ axis:'h', widthLines, lengthLines, totalW:w });
    }
  });

  return { blocks, clusters };
}

// Monta o SVG (folha A4) da 2ª página com a planta de blocos: mesmo estilo
// de cotas da planta baixa, e o MESMO carimbo (buildCarimboSVG) da 1ª
// página — logo, cliente, local da obra, valor, escala/área/data/revisão
// e modelo, só trocando o rótulo de "PLANTA" e a escala (recalculada para
// o conteúdo desta folha).
function buildBlocosSheetSVG(){
  const W=210, H=297, mTop=7, mBot=7, mRight=7, mLeft=25;
  const rW=W-mLeft-mRight, rH=H-mTop-mBot;
  const carimboH=52;
  const headerH=15;
  const planH=rH-headerH-carimboH-5;

  let frame=`<rect x="${mLeft}" y="${mTop}" width="${rW}" height="${rH}" fill="none" stroke="#1C1F24" stroke-width="0.5"/>`;
  let head=`<text x="${mLeft+rW/2}" y="${mTop+8}" font-family="Montserrat, sans-serif" font-size="4.6" font-weight="bold" fill="#1C1F24" text-anchor="middle">PLANTA DE BLOCOS</text>`;
  head+=`<text x="${mLeft+rW/2}" y="${mTop+12.4}" font-family="Montserrat, sans-serif" font-size="2.6" fill="#7A828C" text-anchor="middle">${esc(state.name||"Planta sem título")} — blocos de 15 × 15 cm</text>`;

  const { blocks, clusters } = computeBlocosLayout();
  if(!blocks.length){
    const tb0=buildCarimboSVG(mLeft, rW, mBot, H, carimboH, "—", "PLANTA DE BLOCOS", "A4");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
      <rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>${frame}${head}
      <text x="${mLeft+rW/2}" y="${mTop+headerH+planH/2}" font-family="Montserrat, sans-serif" font-size="3.4" fill="#7A828C" text-anchor="middle">Nenhum piso posicionado — não há blocos para gerar.</text>
      ${tb0}
    </svg>`;
  }

  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  blocks.forEach(b=>{x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x);y1=Math.max(y1,b.y);});
  const bb={x:x0,y:y0,w:Math.max(x1-x0,0.5),h:Math.max(y1-y0,0.5)};

  const SCALES=[25,50,75,100,125,150,200,250,300,400,500];
  const reserveW=24, reserveH=24; // espaço p/ as duas camadas de cota + textos
  const s=SCALES.find(v=>bb.w*1000/v<=rW-reserveW && bb.h*1000/v<=planH-reserveH)||SCALES[SCALES.length-1];
  const mmM=1000/s, dW=bb.w*mmM, dH=bb.h*mmM;
  const ox=mLeft+(rW-dW)/2, oy=mTop+headerH+(planH-dH)/2;
  const X=v=>ox+(v-bb.x)*mmM, Y=v=>oy+(v-bb.y)*mmM;
  const dimLabel=v=>fmt(v)+" m";

  let g="";
  const OUTER=8, INNER=4; // offsets (mm) das duas camadas de cota
  clusters.forEach(cl=>{
    const wl=cl.widthLines, ll=cl.lengthLines;
    if(cl.axis==='v'){
      // Largura (topo, horizontal): total + segmentos — a camada de
      // segmentos só entra quando há mais de 1 segmento; com só 1, ela
      // repetiria o mesmo valor da camada total quase no mesmo lugar,
      // sobrepondo o texto.
      const topY=Y(ll[0]);
      g+=roomDimLine(X(wl[0]),topY,X(wl[wl.length-1]),topY,OUTER,dimLabel(cl.totalW),"top");
      if(wl.length>2) for(let i=0;i<wl.length-1;i++) g+=roomDimLine(X(wl[i]),topY,X(wl[i+1]),topY,INNER,dimLabel(wl[i+1]-wl[i]),"top");
      // Comprimento (esquerda, vertical): total + segmentos de 1,50
      const leftX=X(wl[0]);
      const totalLen=ll[ll.length-1]-ll[0];
      g+=roomDimLine(leftX,Y(ll[0]),leftX,Y(ll[ll.length-1]),OUTER,dimLabel(totalLen),"left");
      if(ll.length>2) for(let i=0;i<ll.length-1;i++) g+=roomDimLine(leftX,Y(ll[i]),leftX,Y(ll[i+1]),INNER,dimLabel(ll[i+1]-ll[i]),"left");
    } else {
      // Comprimento (topo, horizontal): total + segmentos de 1,50
      const topY=Y(wl[0]);
      const totalLen=ll[ll.length-1]-ll[0];
      g+=roomDimLine(X(ll[0]),topY,X(ll[ll.length-1]),topY,OUTER,dimLabel(totalLen),"top");
      if(ll.length>2) for(let i=0;i<ll.length-1;i++) g+=roomDimLine(X(ll[i]),topY,X(ll[i+1]),topY,INNER,dimLabel(ll[i+1]-ll[i]),"top");
      // Largura (direita, vertical): total + segmentos
      const rightX=X(ll[ll.length-1]);
      g+=roomDimLine(rightX,Y(wl[0]),rightX,Y(wl[wl.length-1]),OUTER,dimLabel(cl.totalW),"right");
      if(wl.length>2) for(let i=0;i<wl.length-1;i++) g+=roomDimLine(rightX,Y(wl[i]),rightX,Y(wl[i+1]),INNER,dimLabel(wl[i+1]-wl[i]),"right");
    }
  });


  // Quadradinhos dos blocos (15x15cm reais, na escala da folha) — já
  // centrados na posição correta (com o recuo das pontas aplicado acima).
  const half=(BLOCO_SIZE/2)*mmM;
  blocks.forEach(b=>{
    const cx=X(b.x), cy=Y(b.y);
    g+=`<rect x="${(cx-half).toFixed(2)}" y="${(cy-half).toFixed(2)}" width="${(half*2).toFixed(2)}" height="${(half*2).toFixed(2)}" fill="#fff" stroke="#1C1F24" stroke-width="0.3"/>`;
  });

  const tb=buildCarimboSVG(mLeft, rW, mBot, H, carimboH, "1:"+s, "PLANTA DE BLOCOS", "A4");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>${frame}${head}${g}${tb}
  </svg>`;
}

function buildSheetSVG(dimMode, incluirLabels = true, floorMode = 'andar1'){
  return buildSheetSVGInner(dimMode, incluirLabels, floorMode);
}
function buildSheetSVGInner(dimMode, incluirLabels = true, floorMode = 'andar1'){
  dimMode = dimMode || 'auto';
  const isA2 = floorMode === 'andar2';
  const W=210, H=297;
  const mTop=7, mBot=7, mRight=7, mLeft=25;
  const rW = W - mLeft - mRight; 
  const rH = H - mTop - mBot;
  
  const carimboH = 52;
  const planH = rH - carimboH - 5;
  
  let bb=contentBBox();
  // Manual cotas can sit arbitrarily far from the building (the user chose
  // the offset) — fold their actual geometry into the fit bbox so the scale
  // picked below accounts for them, instead of letting them spill off the page.
  if(dimMode==='manual'){
    (state.manualDims||[]).filter(d=>(d.andar||1)===(isA2?2:1)).forEach(d=>{
      const p1=resolveDimPoint(d,'p1'), p2=resolveDimPoint(d,'p2');
      const{lineP1:q1,lineP2:q2}=dimAxisGeom(p1,p2,d.axis,d.linePos);
      [p1,p2,q1,q2].forEach(([px,py])=>{
        const nx0=Math.min(bb.x,px), ny0=Math.min(bb.y,py);
        const nx1=Math.max(bb.x+bb.w,px), ny1=Math.max(bb.y+bb.h,py);
        bb={x:nx0,y:ny0,w:nx1-nx0,h:ny1-ny0};
      });
    });
  }
  const SCALES=[25,50,75,100,125,150,200,250,300,400,500];
  // Reserve extra mm (scale-independent) so the cota apparatus itself — the
  // fixed offset/text of the auto cota, or the halo/ticks around manual
  // cotas — never lands outside the printable margins. Reducing the scale
  // is preferred over letting any of that spill past the page edge.
  const reserveW = dimMode==='auto' ? 16 : 10;
  const reserveH = dimMode==='auto' ? 12 : 10;
  let s=SCALES.find(v=>bb.w*1000/v<=rW-reserveW && bb.h*1000/v<=planH-reserveH)||SCALES[SCALES.length-1];
  const mmM=1000/s, dW=bb.w*mmM, dH=bb.h*mmM, ox=mLeft+(rW-dW)/2, oy=mTop+(planH-dH)/2;
  const X=v=>ox+(v-bb.x)*mmM, Y=v=>oy+(v-bb.y)*mmM;

  // Pisos x mezaninos: mezaninos (e escadas) são conteúdo do 2º andar — não
  // entram no agrupamento de "ambiente" nem na cota geral do 1º andar,
  // mesmo que fisicamente se sobreponham em X/Y (mezanino tem sua própria
  // dedicated dimension, calculada só no modo/folha 2º andar).
  const nonMezPanels = state.panels.filter(p=>!isFloor2Panel(p));
  const mezPanels = state.panels.filter(p=>isMez(typeOf(p.typeId)));

  // Group adjacent (touching/overlapping) pisos into "ambientes" — but a
  // freestanding wall (wallInstance) running along the shared edge between two
  // pisos means they belong to different ambientes, even if their floor
  // modules are physically touching underneath the wall.
  function rectsAdjacent(a,b,tol){
    tol=tol===undefined?0.06:tol;
    const xOverlap=a.x<b.x+b.w-1e-6 && a.x+a.w>b.x+1e-6;
    const yOverlap=a.y<b.y+b.h-1e-6 && a.y+a.h>b.y+1e-6;
    const xTouch=Math.abs(a.x+a.w-b.x)<=tol || Math.abs(b.x+b.w-a.x)<=tol;
    const yTouch=Math.abs(a.y+a.h-b.y)<=tol || Math.abs(b.y+b.h-a.y)<=tol;
    if(xOverlap&&yOverlap)return{axis:null};
    if(yOverlap&&xTouch){
      const pos=Math.abs(a.x+a.w-b.x)<=tol ? (a.x+a.w+b.x)/2 : (b.x+b.w+a.x)/2;
      return{axis:'x',pos,from:Math.max(a.y,b.y),to:Math.min(a.y+a.h,b.y+b.h)};
    }
    if(xOverlap&&yTouch){
      const pos=Math.abs(a.y+a.h-b.y)<=tol ? (a.y+a.h+b.y)/2 : (b.y+b.h+a.y)/2;
      return{axis:'y',pos,from:Math.max(a.x,b.x),to:Math.min(a.x+a.w,b.x+b.w)};
    }
    return null;
  }
  const wallBoxes=state.wallInstances.map(wi=>wallAABB(wi)).filter(Boolean);
  function wallBlocksSegment(seg){
    if(!seg||!seg.axis)return false;
    return wallBoxes.some(wb=>{
      if(seg.axis==='x'){
        const coversX=wb.x<=seg.pos+0.08 && wb.x+wb.w>=seg.pos-0.08;
        const overlapY=wb.y<seg.to-1e-6 && wb.y+wb.h>seg.from+1e-6;
        return coversX&&overlapY;
      } else {
        const coversY=wb.y<=seg.pos+0.08 && wb.y+wb.h>=seg.pos-0.08;
        const overlapX=wb.x<seg.to-1e-6 && wb.x+wb.w>seg.from+1e-6;
        return coversY&&overlapX;
      }
    });
  }
  const nmRects=nonMezPanels.map(p=>rectOf(p));
  const parentArr=nmRects.map((_,i)=>i);
  function findRoot(i){while(parentArr[i]!==i){parentArr[i]=parentArr[parentArr[i]];i=parentArr[i];}return i;}
  function unionRoot(i,j){const ri=findRoot(i),rj=findRoot(j);if(ri!==rj)parentArr[ri]=rj;}
  for(let i=0;i<nmRects.length;i++)for(let j=i+1;j<nmRects.length;j++){
    const seg=rectsAdjacent(nmRects[i],nmRects[j]);
    if(seg && !wallBlocksSegment(seg))unionRoot(i,j);
  }
  const roomGroups={};
  nmRects.forEach((r,i)=>{const root=findRoot(i);(roomGroups[root]=roomGroups[root]||[]).push(r);});
  // Once grouped, shrink each ambiente's box to the *inner* face of any wall
  // that runs along one of its outer edges, so the cota reflects the real
  // clear interior size (e.g. a 2,29 x 1,85 bathroom), not the piso footprint.
  function refineToInnerFace(box){
    let x0=box.x,y0=box.y,x1=box.x+box.w,y1=box.y+box.h;
    wallBoxes.forEach(wb=>{
      const thin=wb.w<wb.h; // true => vertical wall (thin in x), false => horizontal wall (thin in y)
      if(thin){
        const yOverlap=wb.y<y1-1e-6 && wb.y+wb.h>y0+1e-6;
        if(!yOverlap)return;
        if(wb.x<=x0+0.25 && wb.x+wb.w>=x0-0.05)x0=Math.max(x0,wb.x+wb.w);
        if(wb.x+wb.w>=x1-0.25 && wb.x<=x1+0.05)x1=Math.min(x1,wb.x);
      } else {
        const xOverlap=wb.x<x1-1e-6 && wb.x+wb.w>x0+1e-6;
        if(!xOverlap)return;
        if(wb.y<=y0+0.25 && wb.y+wb.h>=y0-0.05)y0=Math.max(y0,wb.y+wb.h);
        if(wb.y+wb.h>=y1-0.25 && wb.y<=y1+0.05)y1=Math.min(y1,wb.y);
      }
    });
    return{x:x0,y:y0,w:Math.max(x1-x0,0.01),h:Math.max(y1-y0,0.01)};
  }
  const roomBoxes=Object.values(roomGroups).map(rs=>{
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    rs.forEach(r=>{x0=Math.min(x0,r.x);y0=Math.min(y0,r.y);x1=Math.max(x1,r.x+r.w);y1=Math.max(y1,r.y+r.h);});
    return refineToInnerFace({x:x0,y:y0,w:x1-x0,h:y1-y0});
  });

  // Overall project dimension excludes mezaninos and room-label text entirely
  // — only pisos and walls define where the cota geral sits.
  function bboxExcludingMez(){
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,any=false;
    nonMezPanels.forEach(p=>{const r=rectOf(p);any=true;x0=Math.min(x0,r.x);y0=Math.min(y0,r.y);x1=Math.max(x1,r.x+r.w);y1=Math.max(y1,r.y+r.h);});
    state.wallInstances.forEach(inst=>{const corners=wallInstanceWorldCorners(inst);if(!corners)return;
      corners.forEach(([cx,cy])=>{x0=Math.min(x0,cx);y0=Math.min(y0,cy);x1=Math.max(x1,cx);y1=Math.max(y1,cy);});any=true;});
    if(!any)return bb;
    return{x:x0,y:y0,w:Math.max(x1-x0,0.01),h:Math.max(y1-y0,0.01)};
  }
  const dimBB=bboxExcludingMez();

  // ── Bounding boxes (mm) de todas as cotas — calculadas ANTES do
  // posicionamento dos textos de esquadria, para que o algoritmo de
  // evitação de colisão (layoutEsqTexts) também desvie das cotas, e não
  // só dos oitões. São aproximações generosas (não precisam ser pixel-
  // perfect, só impedir que o texto da esquadria pouse em cima da cota).
  const pdfCotaBoxes=[];
  if(dimMode==='auto'){
    // Cota geral do projeto (desenhada mais abaixo, em torno de dimBB).
    const _dox1=X(dimBB.x), _dox2=X(dimBB.x+dimBB.w), _doy1=Y(dimBB.y), _doy2=Y(dimBB.y+dimBB.h);
    const _dimY=_doy1-4.5, _dimX=_dox1-5.5;
    pdfCotaBoxes.push({x1:_dox1-2, y1:_dimY-4, x2:_dox2+2, y2:_doy1+0.5}); // cota horizontal (topo)
    pdfCotaBoxes.push({x1:_dimX-4, y1:_doy1-2, x2:_dox1+0.5, y2:_doy2+2}); // cota vertical (esquerda)
  }
  if(dimMode==='manual'){
    // Cotas manuais — mesma geometria usada no desenho mais abaixo.
    (state.manualDims||[]).filter(d=>(d.andar||1)===(isA2?2:1)).forEach(d=>{
      const p1=resolveDimPoint(d,'p1'), p2=resolveDimPoint(d,'p2');
      const{lineP1:q1,lineP2:q2,len}=dimAxisGeom(p1,p2,d.axis,d.linePos);
      const _sx1=X(q1[0]),_sy1=Y(q1[1]),_sx2=X(q2[0]),_sy2=Y(q2[1]);
      const _mx=(_sx1+_sx2)/2,_my=(_sy1+_sy2)/2;
      const _label=fmt(len)+" m";
      const _haloW=_label.length*1.9+3;
      if(d.axis==="x"){
        pdfCotaBoxes.push({x1:_mx-_haloW/2-1, y1:_my-3, x2:_mx+_haloW/2+1, y2:_my+3});
      } else {
        pdfCotaBoxes.push({x1:_mx-3, y1:_my-_haloW/2-1, x2:_mx+3, y2:_my+_haloW/2+1});
      }
    });
  }
  // Bounding box (mm) de uma cota de ambiente/mezanino (roomDimLine) —
  // mesma geometria usada no desenho, para reservar o espaço com antecedência.
  function roomDimBoxMM(eX1,eY1,eX2,eY2,offset,side){
    if(side==="top"||side==="bottom"){
      const sign=side==="top"?-1:1;
      const dimY=eY1+sign*offset;
      return {x1:Math.min(eX1,eX2)-2, y1:Math.min(dimY,eY1)-3, x2:Math.max(eX1,eX2)+2, y2:Math.max(dimY,eY1)+3};
    } else {
      const sign=side==="left"?-1:1;
      const dimX=eX1+sign*offset;
      return {x1:Math.min(dimX,eX1)-3, y1:Math.min(eY1,eY2)-2, x2:Math.max(dimX,eX1)+3, y2:Math.max(eY1,eY2)+2};
    }
  }

  let g=`<rect x="${mLeft}" y="${mTop}" width="${rW}" height="${rH}" fill="none" stroke="#1C1F24" stroke-width="0.5"/>`;
  const pdfEsqTexts=[], pdfOitaoBoxes=[];
  function pathsToPdfSvg(paths,textSink,opAttr){
    opAttr=opAttr||"";
    let s="";
    (paths||[]).forEach(pd=>{
      if(pd.kind==="line"){
        s+=`<line x1="${X(pd.p1[0])}" y1="${Y(pd.p1[1])}" x2="${X(pd.p2[0])}" y2="${Y(pd.p2[1])}" stroke="${pd.stroke||'#1C1F24'}" stroke-width="${((pd.sw||1)*0.15).toFixed(2)}" vector-effect="non-scaling-stroke"${opAttr}/>`;
      } else if(pd.kind==="doorArc"){
        const hx=X(pd.hinge[0]),hy=Y(pd.hinge[1]);
        const tx=X(pd.tip[0]),ty=Y(pd.tip[1]);
        const ax=X(pd.arcEnd[0]),ay=Y(pd.arcEnd[1]);
        const r=(pd.r*mmM).toFixed(3);
        const sweep=doorArcSweep(pd.hinge,pd.tip,pd.arcEnd);
        s+=`<path d="M ${hx} ${hy} L ${tx} ${ty} A ${r} ${r} 0 0 ${sweep} ${ax} ${ay} Z" fill="${pd.fill||'none'}" fill-opacity="0.55" stroke="${pd.stroke||'#1C1F24'}" stroke-width="0.2"${opAttr}/>`;
      } else if(pd.kind==="arrow"){
        const sx1=X(pd.p1[0]),sy1=Y(pd.p1[1]),sx2=X(pd.p2[0]),sy2=Y(pd.p2[1]);
        const dx=sx2-sx1,dy=sy2-sy1,len=Math.sqrt(dx*dx+dy*dy);
        if(len>0.5){
          const ux=dx/len,uy=dy/len,ah=1.0,aw=0.6;
          const ax=sx2-ux*ah,ay_=sy2-uy*ah;
          s+=`<line x1="${sx1.toFixed(2)}" y1="${sy1.toFixed(2)}" x2="${sx2.toFixed(2)}" y2="${sy2.toFixed(2)}" stroke="${pd.stroke||'#1C1F24'}" stroke-width="0.1"${opAttr}/>`;
          s+=`<polygon points="${sx2.toFixed(2)},${sy2.toFixed(2)} ${(ax-uy*aw).toFixed(2)},${(ay_+ux*aw).toFixed(2)} ${(ax+uy*aw).toFixed(2)},${(ay_-ux*aw).toFixed(2)}" fill="${pd.stroke||'#1C1F24'}"${opAttr}/>`;
        }
      } else if(pd.kind==="text"){
        if(textSink){
          textSink.push({sx:X(pd.pos[0]),sy:Y(pd.pos[1]),text:(pd.text||"").toUpperCase(),fontSize:2.6,fill:pd.fill||"#1C1F24"});
        } else {
          s+=`<text x="${X(pd.pos[0])}" y="${Y(pd.pos[1])}" font-family="Montserrat, sans-serif" font-size="2.6" font-weight="bold" fill="${pd.fill||'#1C1F24'}" text-anchor="middle"${opAttr}>${esc((pd.text||"").toUpperCase())}</text>`;
        }
      }
    });
    return s;
  }
  // Renders esquadria/door labels above everything else, with a white halo and
  // the same row-packing/wrap logic used on screen, so labels never sit hidden
  // under a piso drawn later, nor collide with each other.
  function pdfDrawEsqTexts(items, preBlocked=[]){
    if(!items.length)return "";
    let out="";
    layoutEsqTexts(items, preBlocked).forEach(it=>{
      const lineH=(it.fontSize||10)+1.2;
      const nLines=it.lines?it.lines.length:1;
      const haloPad=0.8;
      const cx=it.sx+(it.dx||0), cy=it.sy+(it.dy||0);
      const labelTop=cy-(it.fontSize||10)*0.8;
      if(Math.hypot(cx-it.sx,cy-it.sy)>0.6){
        out+=`<line x1="${it.sx.toFixed(2)}" y1="${it.sy.toFixed(2)}" x2="${cx.toFixed(2)}" y2="${labelTop.toFixed(2)}" stroke="${it.fill||'#1C1F24'}" stroke-width="0.12" stroke-dasharray="0.6 0.6" opacity="0.55"/>`;
      }
      // Sem rect de fundo: contorno branco via duplo texto (halo branco + fill escuro por cima)
      if(it.lines){
        out+=`<text x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="${it.fontSize}" font-weight="bold" fill="white" stroke="white" stroke-width="1.0" stroke-linejoin="round" text-anchor="middle">`;
        it.lines.forEach((ln,i)=>{out+=`<tspan x="${cx.toFixed(2)}" dy="${i===0?0:(it.fontSize+1.2)}">${esc(ln)}</tspan>`;});
        out+="</text>";
        out+=`<text x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="${it.fontSize}" font-weight="bold" fill="${it.fill||'#1C1F24'}" text-anchor="middle">`;
        it.lines.forEach((ln,i)=>{out+=`<tspan x="${cx.toFixed(2)}" dy="${i===0?0:(it.fontSize+1.2)}">${esc(ln)}</tspan>`;});
        out+="</text>";
      } else {
        out+=`<text x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="${it.fontSize}" font-weight="bold" fill="white" stroke="white" stroke-width="1.0" stroke-linejoin="round" text-anchor="middle">${esc(it.text)}</text>`;
        out+=`<text x="${cx.toFixed(2)}" y="${cy.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="${it.fontSize}" font-weight="bold" fill="${it.fill||'#1C1F24'}" text-anchor="middle">${esc(it.text)}</text>`;
      }
    });
    return out;
  }
  // Small internal dimension line drawn in mm-space, auto-orients its label.
  function dimLine(x1,y1,x2,y2,label,fontSize,color){
    fontSize=fontSize||2.0;color=color||"#7A828C";
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    const horizontal=Math.abs(x2-x1) >= Math.abs(y2-y1);
    let s=`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${color}" stroke-width="0.12"/>`;
    if(horizontal){
      s+=`<text x="${mx.toFixed(2)}" y="${(my-0.7).toFixed(2)}" font-family="Montserrat, sans-serif" font-size="${fontSize}" fill="${color}" text-anchor="middle">${esc(label)}</text>`;
    } else {
      s+=`<text x="${(mx-0.7).toFixed(2)}" y="${my.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="${fontSize}" fill="${color}" text-anchor="middle" transform="rotate(-90 ${(mx-0.7).toFixed(2)} ${my.toFixed(2)})">${esc(label)}</text>`;
    }
    return s;
  }
  const panelOitaoDraws=[]; // Fix (PDF): coleta dados de desenho do oitão de piso para 2ª passagem
  function drawOnePanelPdf(p, dimmed){
      const parts=pisoParts(p);
      const ty=typeOf(p.typeId);
      const opAttr = dimmed ? ' opacity="0.32"' : '';
      parts.rects.forEach(rc=>{g+=`<rect x="${X(rc.x)}" y="${Y(rc.y)}" width="${rc.w*mmM}" height="${rc.h*mmM}" fill="${rc.fill}" stroke="#1C1F24" stroke-width="0.15"${opAttr}/>`;});
      // Referência escurecida do 1º andar na folha do 2º andar: sem texto de
      // esquadria (pedido explícito) — a geometria (arco de porta etc.)
      // continua aparecendo, só esmaecida.
      const pathsForDraw = dimmed ? parts.paths.filter(pd=>pd.kind!=="text") : parts.paths;
      g+=pathsToPdfSvg(pathsForDraw,pdfEsqTexts,opAttr);
      if(!dimmed && parts.name.show&&parts.name.text)g+=`<text x="${X(parts.name.x)}" y="${Y(parts.name.y)+1.2}" font-family="Montserrat, sans-serif" font-size="3.2" font-weight="bold" fill="#1C1F24" text-anchor="middle">${esc(parts.name.text.toUpperCase())}</text>`;
    // ── Oitão: coleta bounding box + dados de desenho aqui; o desenho em si
    // (seta + nome) só acontece numa 2ª passagem, depois de TODOS os pisos e
    // paredes já renderizados — evita que o texto/seta fique escondido sob
    // um piso vizinho desenhado por cima (mesmo fix já aplicado no canvas).
    if(!dimmed && incluirLabels && p.oitaoAtivo && ty && ty.possuiPossibilidadeOitao){
      let _wxP, _wyP;
      if(ty.hwall){
        const _th=ty.hwall.th, _dk=ty.hwall.deck, _d=ty.d, _W=ty.w;
        const [_lxS,_lxE]=hwallLocalXRange(ty.hwall,_W);
        const _midLx=(_lxS+_lxE)/2;
        const _ly0=_d/2-_dk-_th;
        const [_rx,_ry]=rotPoint(_midLx,_ly0,p.rot);
        _wxP=p.cx+_rx; _wyP=p.cy+_ry;
      } else {
        const _r=rectOf(p); const _wr=internalWallRect(p);
        _wxP=_r.x+_r.w/2; _wyP=_wr?_wr.y:_r.y;
      }
      const ax=X(_wxP), ay=Y(_wyP);
      const [onx,ony]=rotPoint(0,-1,p.rot);
      // seta em mm (~2.5 mm base, 2.5 mm altura)
      const aw=2.5, ah=2.5;
      const apx=ax+onx*ah, apy=ay+ony*ah;
      // Registra a bounding box em espaço mm do PDF para evitação de labels
      const _nwP=ty.nomeOitao?ty.nomeOitao.length*1.4:0;
      pdfOitaoBoxes.push({
        x1:Math.min(ax,apx)-aw/2-0.6, y1:Math.min(ay,apy)-aw/2-0.6,
        x2:Math.max(ax,apx)+aw/2+_nwP+0.6, y2:Math.max(ay,apy)+aw/2+(_nwP>0?2.4:0)+0.6
      });
      panelOitaoDraws.push({ax,ay,onx,ony,apx,apy,aw,nomeOitao:ty.nomeOitao});
    }
  }
  if(!isA2){
    // Folha do 1º andar: só painéis do 1º andar (2º andar abandonado aqui).
    state.panels.forEach(p=>{ if(!isFloor2Panel(p)) drawOnePanelPdf(p,false); });
  } else {
    // Folha do 2º andar: 1º andar inteiro primeiro (escurecido, de
    // referência), DEPOIS uma "máscara" branca exatamente sob cada
    // mezanino/escada (apaga a referência escurecida onde eles ficam — só
    // aparece ao redor, não por baixo), e só então mezanino/escada de
    // verdade por cima — igual ao pedido: "só aparece ao redor, mezanino e
    // escada ficam uma camada acima".
    state.panels.forEach(p=>{ if(!isFloor2Panel(p)) drawOnePanelPdf(p,true); });
    drawWallInstancesPdf();
    state.panels.forEach(p=>{
      if(!isFloor2Panel(p)) return;
      const r=rectOf(p); const pad=0.03; // pequena margem (m) pra cobrir a borda/traço do 1º andar por baixo
      g+=`<rect x="${X(r.x-pad)}" y="${Y(r.y-pad)}" width="${(r.w+pad*2)*mmM}" height="${(r.h+pad*2)*mmM}" fill="#ffffff"/>`;
    });
    state.panels.forEach(p=>{ if(isFloor2Panel(p)) drawOnePanelPdf(p,false); });
  }
  if(dimMode==='auto' && isA2){
    // Mezanino dimension: its own pair of cotas, sized to the marrom-claro area only.
    // Só na folha do 2º andar (posição real do mezanino).
    mezPanels.forEach(p=>{
      const ty=typeOf(p.typeId);
      const D=footD(ty);
      const mr=getRotatedSubRect(p,-D/2,ty.d);
      const mx1=X(mr.x), mx2=X(mr.x+mr.w), my1=Y(mr.y), my2=Y(mr.y+mr.h);
      g+=roomDimLine(mx1,my1,mx2,my1,2.4,fmt(mr.w)+" m","top");
      g+=roomDimLine(mx1,my1,mx1,my2,2.4,fmt(mr.h)+" m","left");
      pdfCotaBoxes.push(roomDimBoxMM(mx1,my1,mx2,my1,2.4,"top"));
      pdfCotaBoxes.push(roomDimBoxMM(mx1,my1,mx1,my2,2.4,"left"));
    });
  }
  function drawWallInstancesPdf(){
    state.wallInstances.forEach(inst=>{
      const parts=wallInstanceParts(inst);
      // Paredes avulsas são sempre do 1º andar — viram referência escurecida
      // (sem texto de esquadria) quando a folha sendo montada é a do 2º andar.
      const opAttr = isA2 ? ' opacity="0.32"' : '';
      parts.polys.forEach(po=>{
        const pts=po.pts.map(([x,y])=>`${X(x)},${Y(y)}`).join(" ");
        g+=`<polygon points="${pts}" fill="${po.fill}"${opAttr}/>`;
      });
      const wpathsForDraw = isA2 ? parts.paths.filter(pd=>pd.kind!=="text") : parts.paths;
      g+=pathsToPdfSvg(wpathsForDraw,pdfEsqTexts,opAttr);
    });
  }
  if(!isA2) drawWallInstancesPdf();
  // ── Labels condicionais: esquadrias e oitões de paredes ──────────────
  if(incluirLabels){
  // Coleta bounding boxes dos oitãos de paredes avulsas no espaço mm do PDF
  // (paredes avulsas são sempre 1º andar — sem oitão na folha do 2º andar).
  if(!isA2) state.wallInstances.forEach(wi=>{
    if(!wi.oitaoAtivo) return;
    const wtO=wallTypeOf(wi.wallTypeId);
    if(!wtO||!wtO.possuiPossibilidadeOitao) return;
    const a=wallAABB(wi); if(!a) return;
    const isWide=a.w>=a.h;
    const ax=isWide ? X(a.x+a.w/2) : X(a.x), ay=isWide ? Y(a.y) : Y(a.y+a.h/2);
    const aw=2.5, ah=2.5;
    const _nwP=wtO.nomeOitao?wtO.nomeOitao.length*1.4:0;
    pdfOitaoBoxes.push({x1:ax-aw/2-0.6, y1:ay-ah-(_nwP>0?2.4:0)-0.6, x2:ax+aw/2+_nwP+0.6, y2:ay+0.6});
  });
  g+=pdfDrawEsqTexts(pdfEsqTexts, [...pdfOitaoBoxes, ...pdfCotaBoxes]);
  // ── Fix (PDF): 2ª passagem — oitões de pisos desenhados por cima de tudo ──
  panelOitaoDraws.forEach(o=>{
    const{ax,ay,onx,ony,apx,apy,aw,nomeOitao}=o;
    g+=`<polygon points="${apx.toFixed(2)},${apy.toFixed(2)} ${(ax-ony*aw/2).toFixed(2)},${(ay+onx*aw/2).toFixed(2)} ${(ax+ony*aw/2).toFixed(2)},${(ay-onx*aw/2).toFixed(2)}" fill="#1f331b" stroke="#fff" stroke-width="0.15"/>`;
    if(nomeOitao){
      const tx=(apx+(-ony)*0.8).toFixed(2), ty_=(apy+onx*0.8+0.5).toFixed(2);
      // Duplo texto: halo branco primeiro, fill verde-escuro por cima
      g+=`<text x="${tx}" y="${ty_}" font-family="Montserrat, sans-serif" font-size="2.4" font-weight="700" fill="white" stroke="white" stroke-width="0.8" stroke-linejoin="round">${esc(nomeOitao)}</text>`;
      g+=`<text x="${tx}" y="${ty_}" font-family="Montserrat, sans-serif" font-size="2.4" font-weight="700" fill="#1f331b">${esc(nomeOitao)}</text>`;
    }
  });
  // ── Oitão em wallInstances no PDF (sempre 1º andar) ────────────────────
  if(!isA2) state.wallInstances.forEach(wi=>{
    if(!wi.oitaoAtivo) return;
    const wtO=wallTypeOf(wi.wallTypeId);
    if(!wtO||!wtO.possuiPossibilidadeOitao) return;
    const a=wallAABB(wi); if(!a) return;
    const isWide=a.w>=a.h;
    const ax=isWide ? X(a.x+a.w/2) : X(a.x), ay=isWide ? Y(a.y) : Y(a.y+a.h/2);
    const aw=2.5, ah=2.5;
    g+=`<polygon points="${ax.toFixed(2)},${(ay-ah).toFixed(2)} ${(ax-aw/2).toFixed(2)},${ay.toFixed(2)} ${(ax+aw/2).toFixed(2)},${ay.toFixed(2)}" fill="#1f331b" stroke="#fff" stroke-width="0.15"/>`;
    if(wtO.nomeOitao){
      const tx=(isWide ? ax+aw/2+0.8 : ax-aw/2-0.8).toFixed(2);
      const ty=(ay-0.5).toFixed(2);
      const anchor=isWide ? "start" : "end";
      // Duplo texto: halo branco primeiro, fill verde-escuro por cima
      g+=`<text x="${tx}" y="${ty}" font-family="Montserrat, sans-serif" font-size="2.4" font-weight="700" fill="white" stroke="white" stroke-width="0.8" stroke-linejoin="round" text-anchor="${anchor}">${esc(wtO.nomeOitao)}</text>`;
      g+=`<text x="${tx}" y="${ty}" font-family="Montserrat, sans-serif" font-size="2.4" font-weight="700" fill="#1f331b" text-anchor="${anchor}">${esc(wtO.nomeOitao)}</text>`;
    }
  });
  } // end if(incluirLabels)
  state.labels.forEach(l=>{
    const lines=(l.text||'').split('\n');
    const lineH=4;
    const lx=X(l.x), ly=Y(l.y);
    const lOpAttr = isA2 ? ' opacity="0.32"' : '';
    // Linha de chamada (âncora), se definida — mesma lógica do canvas
    if(l.leaderAnchor){
      const lax=X(l.leaderAnchor.x), lay=Y(l.leaderAnchor.y);
      g+=`<line x1="${lax.toFixed(2)}" y1="${lay.toFixed(2)}" x2="${lx.toFixed(2)}" y2="${ly.toFixed(2)}" stroke="#7A828C" stroke-width="0.25" stroke-dasharray="1 1"${lOpAttr}/>`;
      g+=`<circle cx="${lax.toFixed(2)}" cy="${lay.toFixed(2)}" r="0.7" fill="#7A828C"${lOpAttr}/>`;
    }
    const tspans=lines.map((ln,i)=>`<tspan x="${lx.toFixed(2)}" dy="${i===0?0:lineH}">${esc(ln.toUpperCase())}</tspan>`).join('');
    g+=`<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" font-family="Montserrat, sans-serif" font-size="3.4" font-weight="bold" fill="#1C1F24" text-anchor="middle"${lOpAttr}>${tspans}</text>`;
  });

  if(dimMode==='manual'){
    // Manual cotas: whatever the user created with the dimension tool on the
    // project page, between two piso extremities or wall edges. Always
    // purely horizontal (X) or vertical (Y) — never diagonal — matching the
    // live canvas exactly.
    (state.manualDims||[]).filter(d=>(d.andar||1)===(isA2?2:1)).forEach(d=>{
      const p1=resolveDimPoint(d,'p1'), p2=resolveDimPoint(d,'p2');
      const{lineP1:q1,lineP2:q2,len}=dimAxisGeom(p1,p2,d.axis,d.linePos);
      const label=fmt(len)+" m";
      const sx1=X(q1[0]),sy1=Y(q1[1]),sx2=X(q2[0]),sy2=Y(q2[1]);
      const ex1=X(p1[0]),ey1=Y(p1[1]),ex2=X(p2[0]),ey2=Y(p2[1]);
      const mx=(sx1+sx2)/2, my=(sy1+sy2)/2;
      const haloW=label.length*1.9+3;
      let extLines, tickTx, tickTy, textRot;
      if(d.axis==="x"){
        extLines=`<line x1="${ex1.toFixed(2)}" y1="${ey1.toFixed(2)}" x2="${ex1.toFixed(2)}" y2="${sy1.toFixed(2)}" stroke="#1C1F24" stroke-width="0.12"/>
                   <line x1="${ex2.toFixed(2)}" y1="${ey2.toFixed(2)}" x2="${ex2.toFixed(2)}" y2="${sy2.toFixed(2)}" stroke="#1C1F24" stroke-width="0.12"/>`;
        tickTx=0;tickTy=1.6;textRot=0;
      } else {
        extLines=`<line x1="${ex1.toFixed(2)}" y1="${ey1.toFixed(2)}" x2="${sx1.toFixed(2)}" y2="${ey1.toFixed(2)}" stroke="#1C1F24" stroke-width="0.12"/>
                   <line x1="${ex2.toFixed(2)}" y1="${ey2.toFixed(2)}" x2="${sx2.toFixed(2)}" y2="${ey2.toFixed(2)}" stroke="#1C1F24" stroke-width="0.12"/>`;
        tickTx=1.6;tickTy=0;textRot=-90;
      }
      g+=`${extLines}
          <line x1="${sx1.toFixed(2)}" y1="${sy1.toFixed(2)}" x2="${sx2.toFixed(2)}" y2="${sy2.toFixed(2)}" stroke="#1C1F24" stroke-width="0.2"/>
          <line x1="${(sx1-tickTx).toFixed(2)}" y1="${(sy1-tickTy).toFixed(2)}" x2="${(sx1+tickTx).toFixed(2)}" y2="${(sy1+tickTy).toFixed(2)}" stroke="#1C1F24" stroke-width="0.2"/>
          <line x1="${(sx2-tickTx).toFixed(2)}" y1="${(sy2-tickTy).toFixed(2)}" x2="${(sx2+tickTx).toFixed(2)}" y2="${(sy2+tickTy).toFixed(2)}" stroke="#1C1F24" stroke-width="0.2"/>
          <g transform="rotate(${textRot} ${mx.toFixed(2)} ${my.toFixed(2)})">
            <rect x="${(mx-haloW/2).toFixed(2)}" y="${(my-2.4).toFixed(2)}" width="${haloW.toFixed(2)}" height="4" rx="0.5" fill="rgba(255,255,255,.85)"/>
            <text x="${mx.toFixed(2)}" y="${(my+0.9).toFixed(2)}" font-family="Montserrat, sans-serif" font-size="2.6" fill="#1C1F24" text-anchor="middle">${esc(label)}</text>
          </g>`;
    });
  }

  if(dimMode==='auto'){
    const dox1=X(dimBB.x), dox2=X(dimBB.x+dimBB.w), doy1=Y(dimBB.y), doy2=Y(dimBB.y+dimBB.h);
    const dimY=doy1-4.5,dimX=dox1-5.5;
    g+=`<line x1="${dox1}" y1="${doy1}" x2="${dox1}" y2="${dimY-0.5}" stroke="#1C1F24" stroke-width="0.12"/>
        <line x1="${dox2}" y1="${doy1}" x2="${dox2}" y2="${dimY-0.5}" stroke="#1C1F24" stroke-width="0.12"/>
        <line x1="${dox1}" y1="${dimY}" x2="${dox2}" y2="${dimY}" stroke="#1C1F24" stroke-width="0.25"/>
        <line x1="${dox1}" y1="${dimY-1.4}" x2="${dox1}" y2="${dimY+1.4}" stroke="#1C1F24" stroke-width="0.25"/>
        <line x1="${dox2}" y1="${dimY-1.4}" x2="${dox2}" y2="${dimY+1.4}" stroke="#1C1F24" stroke-width="0.25"/>
        <text x="${(dox1+dox2)/2}" y="${dimY-1}" font-family="Montserrat, sans-serif" font-size="3" fill="#1C1F24" text-anchor="middle">${fmt(dimBB.w)}</text>
        <line x1="${dox1}" y1="${doy1}" x2="${dimX-0.5}" y2="${doy1}" stroke="#1C1F24" stroke-width="0.12"/>
        <line x1="${dox1}" y1="${doy2}" x2="${dimX-0.5}" y2="${doy2}" stroke="#1C1F24" stroke-width="0.12"/>
        <line x1="${dimX}" y1="${doy1}" x2="${dimX}" y2="${doy2}" stroke="#1C1F24" stroke-width="0.25"/>
        <line x1="${dimX-1.4}" y1="${doy1}" x2="${dimX+1.4}" y2="${doy1}" stroke="#1C1F24" stroke-width="0.25"/>
        <line x1="${dimX-1.4}" y1="${doy2}" x2="${dimX+1.4}" y2="${doy2}" stroke="#1C1F24" stroke-width="0.25"/>
        <text x="${dimX-1}" y="${(doy1+doy2)/2}" font-family="Montserrat, sans-serif" font-size="3" fill="#1C1F24" text-anchor="middle" transform="rotate(-90 ${dimX-1} ${(doy1+doy2)/2})">${fmt(dimBB.h)}</text>`;
  }
  
  const tb = buildCarimboSVG(mLeft, rW, mBot, H, carimboH, "1:"+s, isA2 ? "PB TÉCNICA 2º ANDAR" : "PB TÉCNICA", "A4");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#ffffff"/>${g}${tb}</svg>`;
}

// ── Carimbo (selo/title-block) padrão da folha A4 — logo, valor do
// orçamento, projetado por, cliente, local da obra, escala/área/data/
// revisão e modelo/planta/folha. Extraído de buildSheetSVG para ser
// reaproveitado, IDÊNTICO, em qualquer página adicional (ex: planta de
// blocos), mudando apenas o texto de escala e do campo "PLANTA".
function buildCarimboSVG(mLeft, rW, mBot, H, carimboH, scaleLabel, plantaLabel, folhaLabel){
  const m=state.meta,today=new Date().toLocaleDateString("pt-BR");
  const cell=(x,y,w,h,label,value,vs)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#888" stroke-width="0.3"/>
    <text x="${x+2}" y="${y+3.3}" font-family="Montserrat, sans-serif" font-size="2.3" fill="#9099A3" letter-spacing="0.2">${esc(label)}</text>
    <text x="${x+2}" y="${y+h-2.6}" font-family="Montserrat, sans-serif" font-size="${vs||3.6}" font-weight="bold" fill="#1C1F24">${esc(String(value||"—").slice(0,42).toUpperCase())}</text>`;

  const TX=mLeft, TW=rW;
  let ty = H - mBot - carimboH;
  let tb = "";

  tb+=`<rect x="${TX}" y="${ty}" width="${TW}" height="15" fill="none" stroke="#888" stroke-width="0.3"/>`;

  if(m.logo) {
    tb+=`<image x="${TX+2}" y="${ty+1}" width="50" height="13" href="${m.logo}" preserveAspectRatio="xMinYMid meet"/>`;
  } else {
    const logoPlaceholder = `
      <polygon points="${TX+8},${ty+12.5} ${TX+11.4},${ty+5.5} ${TX+19},${ty+5.5} ${TX+15.6},${ty+12.5}" fill="#E8590C"/>
      <line x1="${TX+9.6}" y1="${ty+9}" x2="${TX+13}" y2="${ty+9}" stroke="#fff" stroke-width="0.5"/>
      <line x1="${TX+11}" y1="${ty+11}" x2="${TX+14.6}" y2="${ty+11}" stroke="#fff" stroke-width="0.5"/>
      <text x="${TX+20}" y="${ty+12}" font-family="Montserrat, sans-serif" font-weight="bold" font-size="8.5" fill="#E8590C">321</text>
      <text x="${TX+33}" y="${ty+12}" font-family="Montserrat, sans-serif" font-weight="bold" font-size="7" letter-spacing="0.4" fill="#1C1F24">MODULAR</text>
    `;
    tb += logoPlaceholder;
  }

  // ── Ponto 7: valor do orçamento entre a logo e "Projetado por" ─────────
  if (state.incluirValorNaPlanta !== false && pricingData) {
    const itensVB = gerarItensOrcamento();
    const totalVB = itensVB.reduce((s,i)=>s+(i.subtotal||0),0);
    if (totalVB > 0) {
      const descAbsVB = qDesconto.tipo === 'percent'
        ? totalVB * (qDesconto.valor / 100)
        : Math.min(qDesconto.valor, totalVB);
      const valorFinalVB = Math.max(0, totalVB - descAbsVB);
      const vbX = TX + 55;
      // Ponto 1: divisórias verticais separando logo | valor | projetado por,
      // encostando na linha de cima (ty) e de baixo (ty+15) da faixa.
      tb += `<line x1="${TX+52.5}" y1="${ty}" x2="${TX+52.5}" y2="${ty+15}" stroke="#888" stroke-width="0.3"/>`;
      tb += `<line x1="${TX+TW-58}" y1="${ty}" x2="${TX+TW-58}" y2="${ty+15}" stroke="#888" stroke-width="0.3"/>`;
      tb += `<text x="${vbX}" y="${ty+4}" font-family="Montserrat, sans-serif" font-size="2.3" fill="#9099A3">VALOR DO ORÇAMENTO</text>
        <text x="${vbX}" y="${ty+11.5}" font-family="Montserrat, sans-serif" font-size="4.6" font-weight="bold" fill="#1f331b">R$ ${valorFinalVB.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</text>`;
    }
  }

  tb+=`<rect x="${TX+TW-58}" y="${ty}" width="58" height="15" fill="none" stroke="#888" stroke-width="0.3"/>
    <text x="${TX+TW-56}" y="${ty+4}" font-family="Montserrat, sans-serif" font-size="2.3" fill="#9099A3">PROJETADO POR</text>
    <text x="${TX+TW-56}" y="${ty+11.5}" font-family="Montserrat, sans-serif" font-size="4.6" font-weight="bold" fill="#1C1F24">${esc((m.projetadoPor||"").toUpperCase())}</text>`;
  ty+=15;
  tb+=cell(TX,ty,TW/2,13,"CLIENTE",m.cliente,4)+cell(TX+TW/2,ty,TW/2,13,"LOCAL DA OBRA",m.local,4);ty+=13;

  const q=TW/4;
  tb+=cell(TX,ty,q,12,"ESCALA",scaleLabel)+cell(TX+q,ty,q,12,"ÁREA",fmt(occupiedArea())+" m²")
     +cell(TX+2*q,ty,q,12,"DATA",today)+cell(TX+3*q,ty,q,12,"REVISÃO",m.revisao);ty+=12;

  tb+=cell(TX,ty,TW*0.5,12,"MODELO",m.modelo||state.name||"Planta sem título",4)+cell(TX+TW*0.5,ty,TW*0.30,12,"PLANTA",plantaLabel||"PB TÉCNICA")
     +cell(TX+TW*0.80,ty,TW*0.20,12,"FOLHA",folhaLabel||"A4");
  return tb;
}

const MONTSERRAT_FONT_URLS={
  normal:"https://github.com/JulietaUla/Montserrat/raw/refs/heads/master/fonts/ttf/Montserrat-Regular.ttf",
  bold:"https://github.com/JulietaUla/Montserrat/raw/refs/heads/master/fonts/ttf/Montserrat-Bold.ttf",
};
let _montserratB64Cache={};
function arrayBufferToBase64(buf){
  const bytes=new Uint8Array(buf);let binary="";const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode.apply(null,bytes.subarray(i,i+chunk));
  return btoa(binary);
}
async function loadMontserratIntoDoc(doc){
  for(const style of Object.keys(MONTSERRAT_FONT_URLS)){
    if(!_montserratB64Cache[style]){
      const res=await fetch(MONTSERRAT_FONT_URLS[style]);
      if(!res.ok)throw new Error("Falha ao baixar fonte Montserrat ("+style+")");
      _montserratB64Cache[style]=arrayBufferToBase64(await res.arrayBuffer());
    }
    const fname="Montserrat-"+style+".ttf";
    doc.addFileToVFS(fname,_montserratB64Cache[style]);
    doc.addFont(fname,"Montserrat",style);
  }
}

// Injeta assinatura rotacionada 90° na margem esquerda da folha (x: 0–25 mm está livre no SVG)
function injetarAssinaturaPDF(doc) {
  const grafite = [32, 32, 32];

  // x central da margem esquerda (faixa de 0 a 25 mm — completamente vazia no SVG)
  const lx  = 12;    // posição x da linha de assinatura
  const ly1 = 88;    // topo da linha vertical
  const ly2 = 210;   // base da linha vertical
  const cy  = (ly1 + ly2) / 2; // centro para ancorar o texto

  doc.setDrawColor(...grafite);
  doc.setLineWidth(0.4);
  // Linha vertical de assinatura ao longo da margem esquerda
  doc.line(lx, ly1, lx, ly2);

  // "Assinatura do Cliente" rotacionada 90° CCW — lê-se de baixo para cima
  // O texto aparece 4 mm à direita da linha (no espaço entre a linha e o conteúdo)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...grafite);
  doc.text("Assinatura do Cliente", lx + 4, cy, { angle: 90, align: "center" });

  doc.setTextColor(0); doc.setDrawColor(0);
}

// ── Appends a "planta de blocos" (fundação) page to an existing jsPDF doc ──
// ── Appends the 2º andar (mezanino/escada) as a separate PDF page ─────────
// Mesma folha/carimbo da planta baixa, só que com floorMode='andar2':
// mezanino/escada na posição REAL (não mais o "bloco" antigo) e o 1º andar
// aparece transparente/escurecido como referência — igual ao canvas.
async function appendAndar2SheetAoPDF(doc, dimMode, incluirLabels){
  const svgStr=buildSheetSVGInner(dimMode, incluirLabels, 'andar2');
  doc.addPage();
  const parser=new DOMParser();
  const svgDoc=parser.parseFromString(svgStr,"image/svg+xml");
  const svgEl=svgDoc.documentElement;
  svgEl.style.cssText="position:fixed;left:-99999px;top:0;width:210mm;height:297mm;";
  document.body.appendChild(svgEl);
  try{
    await doc.svg(svgEl,{x:0,y:0,width:210,height:297});
  } finally {
    document.body.removeChild(svgEl);
  }
}
// Called by generatePDF when the user checks "Gerar planta de blocos" no
// modal de exportação. Sempre a 2ª página (antes do orçamento, se houver).
async function appendBlocosSheetAoPDF(doc){
  const svgStr=buildBlocosSheetSVG();
  doc.addPage();
  const parser=new DOMParser();
  const svgDoc=parser.parseFromString(svgStr,"image/svg+xml");
  const svgEl=svgDoc.documentElement;
  svgEl.style.cssText="position:fixed;left:-99999px;top:0;width:210mm;height:297mm;";
  document.body.appendChild(svgEl);
  try{
    await doc.svg(svgEl,{x:0,y:0,width:210,height:297});
  } finally {
    document.body.removeChild(svgEl);
  }
}

// ── Appends a simplified budget page to an existing jsPDF doc ────────────
// Called by generatePDF when the user checks "Incluir orçamento" in the modal.
// Shows component list + total only (no unit prices, as stated in the modal).
function appendOrcamentoSimplificadoAoPDF(doc) {
  if (!pricingData) return;

  const itens  = gerarItensOrcamento();
  if (!itens.length) return; // nothing to show

  const proj   = state.name || "Planta sem título";

  // Ponto 6: só entram na lista impressa os insumos marcados como
  // "Compra com Indústria" — produtos normais sempre aparecem.
  // Ponto 3: painéis e insumos ficam em tabelas separadas, sem nenhum
  // valor/preço — o valor do orçamento só aparece na planta (Ponto 7).
  const paineisVisiveis = itens.filter(it => !it.isInsumo);
  const insumosVisiveis = itens.filter(it => it.isInsumo && insumoCompraIndustria(it.nome));

  doc.addPage();

  // ── Faixa de cabeçalho (idêntica ao PDF de orçamento) ────────────────
  doc.setFillColor(31, 51, 27);
  doc.rect(0, 0, 210, 8, "F");
  doc.setFillColor(167, 199, 152);
  doc.rect(0, 8, 210, 2, "F");

  // Título
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 51, 27);
  doc.text("LISTA DE COMPONENTES", 14, 22);

  // Informações do projeto
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(32, 32, 32);
  doc.text(`Projeto: ${proj}`, 14, 30);
  doc.setFont("helvetica", "normal");
  doc.text(`Franquia: ${pricingData.franquia}`, 14, 35);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 40);

  // Linha divisória
  doc.setDrawColor(208, 226, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 44, 196, 44);

  const tableStyles = {
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [32, 32, 32],
      lineColor: [208, 226, 200],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [31, 51, 27],
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [250, 252, 249]
    },
    // Larguras fixas (em vez de "auto") para que a divisória entre as
    // colunas fique alinhada entre as duas tabelas (painéis e insumos).
    columnStyles: {
      0: { cellWidth: 134 },
      1: { halign: "right", cellWidth: 48 },
    },
  };

  // ── Tabela 1: Painéis / Produtos ──────────────────────────────────────
  const totalPaineisQtd = paineisVisiveis.reduce((s, it) => s + (it.qtdFinal || 0), 0);
  doc.autoTable({
    startY: 50,
    head: [["Painéis / Produtos", "Qtd."]],
    body: paineisVisiveis.length
      ? paineisVisiveis.map(it => [it.nome + (it.isAvulso ? ' ★' : ''), String(it.qtdFinal)])
      : [["— nenhum painel —", ""]],
    foot: paineisVisiveis.length ? [["Total de painéis", String(totalPaineisQtd)]] : undefined,
    footStyles: { fillColor: [231, 241, 227], textColor: [31, 51, 27], fontStyle: "bold" },
    ...tableStyles,
  });

  // ── Tabela 2: Insumos complementares (sem título — só a tabela) ────────
  if (insumosVisiveis.length) {
    const totalInsumosQtd = insumosVisiveis.reduce((s, it) => s + (it.qtdFinal || 0), 0);
    const startY2 = (doc.lastAutoTable?.finalY || 50) + 8;
    doc.autoTable({
      startY: startY2,
      head: [["Insumo", "Qtd."]],
      body: insumosVisiveis.map(it => [it.nome, String(it.qtdFinal)]),
      foot: [["Total de insumos", String(totalInsumosQtd)]],
      footStyles: { fillColor: [231, 241, 227], textColor: [31, 51, 27], fontStyle: "bold" },
      ...tableStyles,
    });
  }
}

async function generatePDF(action = 'save', dimMode = 'auto', incluirOrcamento = false, incluirLabels = true, incluirBlocos = false){
  toast("Gerando PDF (vetorial)…");
  const svgStr=buildSheetSVG(dimMode, incluirLabels);
  const fname=(state.meta.modelo||state.name||"planta").replace(/[^\w\-]+/g,"_");
  const js=window.jspdf&&window.jspdf.jsPDF;

  if(js && js.API && typeof js.API.svg==="function"){
    let svgEl=null;
    try{
      const doc=new js({orientation:"portrait",unit:"mm",format:"a4"});
      try{ await loadMontserratIntoDoc(doc); }
      catch(fe){ console.warn("Não foi possível baixar a fonte Montserrat para o PDF (sem internet?). Usando fonte padrão.",fe); }
      const parser=new DOMParser();
      const svgDoc=parser.parseFromString(svgStr,"image/svg+xml");
      svgEl=svgDoc.documentElement;
      svgEl.style.cssText="position:fixed;left:-99999px;top:0;width:210mm;height:297mm;";
      document.body.appendChild(svgEl);
      await doc.svg(svgEl,{x:0,y:0,width:210,height:297});
      document.body.removeChild(svgEl);
      injetarAssinaturaPDF(doc);
      // 2º andar (mezanino/escada) em folha separada, só se o projeto
      // realmente tiver algo posicionado lá — sem isso, o PDF ganharia uma
      // página em branco/só com a referência do 1º andar à toa.
      if(state.panels.some(isFloor2Panel)) await appendAndar2SheetAoPDF(doc, dimMode, incluirLabels);
      if (incluirBlocos) await appendBlocosSheetAoPDF(doc);
      if (incluirOrcamento) appendOrcamentoSimplificadoAoPDF(doc);
      if (action === 'preview') {
          document.getElementById('previewFrame').src = doc.output('bloburl');
          document.getElementById('previewScrim').classList.add('show');
          document.getElementById('previewSaveBtn').onclick = () => { doc.save(fname+".pdf"); };
      } else {
          doc.save(fname+".pdf");
          toast("PDF vetorial gerado.");
      }
      return;
    }catch(e){
      console.error("Falha ao gerar PDF vetorial, tentando alternativa:",e);
      if(svgEl&&svgEl.parentNode)svgEl.parentNode.removeChild(svgEl);
    }
  }

  toast("Gerando PDF (modo compatibilidade)…");
  const img=new Image();
  const url=URL.createObjectURL(new Blob([svgStr],{type:"image/svg+xml"}));
  img.onload=()=>{const cv=document.createElement("canvas");cv.width=210*12;cv.height=297*12;
    const cx=cv.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,cv.width,cv.height);cx.drawImage(img,0,0,cv.width,cv.height);
    URL.revokeObjectURL(url);
    if(js){
        try{
            const doc=new js({orientation:"portrait",unit:"mm",format:"a4"});
            doc.addImage(cv.toDataURL("image/jpeg",0.95),"JPEG",0,0,210,297);
            injetarAssinaturaPDF(doc);
            if (incluirOrcamento) appendOrcamentoSimplificadoAoPDF(doc);
            if (action === 'preview') {
                document.getElementById('previewFrame').src = doc.output('bloburl');
                document.getElementById('previewScrim').classList.add('show');
                document.getElementById('previewSaveBtn').onclick = () => { doc.save(fname+".pdf"); };
            } else {
                doc.save(fname+".pdf");
                toast("PDF gerado (raster).");
            }
            return;
        }catch(e){}
    }
    cv.toBlob(b=>{
        const a=document.createElement("a");
        const purl=URL.createObjectURL(b);
        a.href=purl;
        if (action === 'preview') {
            document.getElementById('previewFrame').src = purl;
            document.getElementById('previewScrim').classList.add('show');
            document.getElementById('previewSaveBtn').onclick = () => {
                a.download=fname+".png"; a.click(); 
            };
        } else {
            a.download=fname+".png";a.click();URL.revokeObjectURL(purl);
            toastError("Gerador de PDF indisponível — baixei como PNG.");
        }
    },"image/png");
  };
  img.onerror=()=>alert("Falha ao gerar o PDF.");img.src=url;
}

let toastT;function toast(msg){let t=document.getElementById("_toast");
  if(!t){t=document.createElement("div");t.id="_toast";
    t.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#1C1F24;color:#fff;padding:9px 16px;border-radius:8px;font-family:'Montserrat',sans-serif;font-size:13px;z-index:99;transition:opacity .3s;box-shadow:var(--shadow);pointer-events:none;";
    document.body.appendChild(t);}
  t.textContent=msg;t.style.opacity="1";clearTimeout(toastT);toastT=setTimeout(()=>t.style.opacity="0",1800);}

let toastErrT;function toastError(msg){
  let overlay=document.getElementById("_toastErrOverlay");
  if(!overlay){
    overlay=document.createElement("div");overlay.id="_toastErrOverlay";
    overlay.style.cssText="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:200;pointer-events:none;";
    document.body.appendChild(overlay);
  }
  let t=document.getElementById("_toastErr");
  if(!t){
    t=document.createElement("div");t.id="_toastErr";
    t.style.cssText="background:#1C1F24;color:#fff;padding:14px 22px;border-radius:12px;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;transition:opacity .35s;box-shadow:0 8px 32px rgba(0,0,0,.35);display:flex;align-items:center;gap:10px;max-width:90vw;text-align:center;opacity:0;";
    overlay.appendChild(t);
  }
  t.innerHTML=`<span data-planta-style="planta-inline-081">⚠️</span><span>${msg}</span>`;
  t.style.opacity="1";
  clearTimeout(toastErrT);toastErrT=setTimeout(()=>t.style.opacity="0",2600);
}

function fecharMenuPlanta(){
  document.getElementById("aside").classList.remove("open");
  document.getElementById("planta-aside-backdrop").classList.remove("active");
}
function abrirMenuPlanta(){
  document.getElementById("aside").classList.add("open");
  document.getElementById("planta-aside-backdrop").classList.add("active");
}
document.getElementById("menuToggle").onclick=()=>{
  const aside=document.getElementById("aside");
  const wasOpen=aside.classList.contains("open");
  wasOpen ? fecharMenuPlanta() : abrirMenuPlanta();
  if(wasOpen){
    tool="pan";selId=null;setTool();renderInv();render();
  }
};
document.getElementById("planta-aside-backdrop").addEventListener("click",fecharMenuPlanta);
document.getElementById("tabsContainer").addEventListener("click",(event)=>{
  if(event.target.closest(".tbtn")) fecharMenuPlanta();
});window.addEventListener("resize",render);
document.getElementById("headerLogo").src=DEFAULT_LOGO;
document.getElementById("projName").value=state.name||"";
renderTabs();renderInv();render();fit();
// ============================================================
// MÓDULO DE QUANTITATIVO — Versão com autenticação por Token
// Os preços vêm exclusivamente do backend (Google Apps Script).
// O frontend é "cego": não conhece custos, margens ou franquias.
// ============================================================

// ── Lookup de preço por nome de produto (O(1)) ───────────────
function getPriceForType(typeName) {
  const entry = pricingMap[typeName] || pricingMap[String(typeName || '').trim()] || pricingMap[chaveCatalogo(typeName)];
  return entry && Number.isFinite(Number(entry.precoFinal)) ? Number(entry.precoFinal) : null;
}

// ── Lookup de preço por nome de insumo, a partir do catálogo geral ──────
// (pricingData.insumosCatalog — independe de estar ligado a um painel
// já presente na planta, permite adicionar insumos "avulsos").
function getPriceForInsumo(nome) {
  const entry = (pricingData?.insumosCatalog || []).find(i => i.nome === nome || chaveCatalogo(i.nome) === chaveCatalogo(nome));
  return entry && Number.isFinite(Number(entry.precoFinal)) ? Number(entry.precoFinal) : null;
}

// ── BOM_CONFIG — tradutor de painéis visuais → produtos reais ─────────────
// Cada chave é o ty.name exato do painel.
// Cada valor é uma função (panel, ty) → [{nome, qty}]
// "nome" deve bater com a coluna A da aba "Produtos" no Google Sheets.
//
// REGRAS DE COMPOSIÇÃO:
//   p.walls.l / p.walls.r : "solid" | "window" | "door" | null
//   p.esquadrias           : array de esquadrias posicionadas no painel
//
// Para adicionar um novo tipo, copie um bloco existente e ajuste.
// Produtos sem entrada no BOM_CONFIG usam o próprio ty.name como fallback.
const BOM_CONFIG = {
  // ── Exemplo: A-Frame ───────────────────────────────────────────────────
  "A-Frame - MZ01 / Mezanino 2,4M": (p, ty) => {
    const itens = [{ nome: "MZ01 - Módulo Mezanino 2,4M", qty: 1 }];
    const walls = p.walls || {};
    // Paredes laterais
    if (walls.l === "solid")  itens.push({ nome: "PC01 - Parede Fechada Lateral", qty: 1 });
    if (walls.l === "window") itens.push({ nome: "PC27 - Parede Maxim-ar", qty: 1 }, { nome: "MR05 - Esquadria Maxim-ar", qty: 1 });
    if (walls.r === "solid")  itens.push({ nome: "PC01 - Parede Fechada Lateral", qty: 1 });
    if (walls.r === "window") itens.push({ nome: "PC27 - Parede Maxim-ar", qty: 1 }, { nome: "MR05 - Esquadria Maxim-ar", qty: 1 });
    return itens;
  },
  // ── Exemplo: Cabana ────────────────────────────────────────────────────
  "Cabana": (p, ty) => {
    const itens = [{ nome: "CB01 - Módulo Cabana Base", qty: 1 }];
    const walls = p.walls || {};
    if (walls.l === "solid")  itens.push({ nome: "PC01 - Parede Fechada Lateral", qty: 1 });
    if (walls.l === "window") itens.push({ nome: "PC14 - Parede Janela Cabana", qty: 1 });
    if (walls.r === "solid")  itens.push({ nome: "PC01 - Parede Fechada Lateral", qty: 1 });
    if (walls.r === "window") itens.push({ nome: "PC14 - Parede Janela Cabana", qty: 1 });
    return itens;
  },
  // ── Adicione outros tipos aqui ──────────────────────────────────────────
};

// ── Avalia se uma condição BOM é atendida pelo painel atual ──────────────
//
// Para pisos:
//   Detecta contextualmente o painel de parede imediatamente adjacente à
//   esquerda (p.walls.l) ou à direita (p.walls.r) deste piso.
//   "Sólida"   → walls.l/r === "solid"
//   "Aberturas"→ walls.l/r === "window" | "door"
//   "Com recortes de quina" → qualquer canto ativo em p.corners (tl/tr/bl/br)
//
// Para paredes (wallType):
//   Verifica a posição (hinge) da primeira esquadria/door do tipo de parede.
//   "Esquerda" → door.hinge === "esquerda"
//   "Direita"  → door.hinge === "direita"
//
function avaliarCondicaoBOM(cond, panel) {
  if (cond === "padrao") return true;

  // ── Oitão ativo (pisos e paredes) ────────────────────────────────────
  if (cond === "oitao_ativo") return !!panel.oitaoAtivo;

  // ── Condições de ESCADA ─────────────────────────────────────────────
  if (cond === "escada_com_patamar" || cond === "escada_sem_patamar") {
    const ty = typeOf(panel.typeId);
    const temPatamar = !!(ty && ty.patamar);
    return cond === "escada_com_patamar" ? temPatamar : !temPatamar;
  }

  // ── Condições de PISO ──────────────────────────────────────────────────
  if (cond === "piso_com_quina") {
    const c = panel.corners || {};
    return !!(c.tl || c.tr || c.bl || c.br);
  }
  if (cond === "piso_parede_esq_solida") {
    return (panel.walls || {}).l === "solid";
  }
  if (cond === "piso_parede_esq_aberturas") {
    const side = (panel.walls || {}).l;
    return side === "open" || side === "window" || side === "door";
  }
  if (cond === "piso_parede_dir_solida") {
    return (panel.walls || {}).r === "solid";
  }
  if (cond === "piso_parede_dir_aberturas") {
    const side = (panel.walls || {}).r;
    return side === "open" || side === "window" || side === "door";
  }

  // ── Condições de PAREDE (wallInstance) ────────────────────────────────
  if (cond === "esq_esquadria_esq" || cond === "esq_esquadria_dir") {
    const wt = wallTypeOf(panel.wallTypeId);
    if (!wt) return false;
    const allDoors = (wt.doors && wt.doors.length) ? wt.doors : (wt.door ? [wt.door] : []);
    const effectiveHinge = panel.doorHinge || (allDoors[0] && allDoors[0].hinge) || 'esquerda';
    if (cond === "esq_esquadria_esq") return effectiveHinge === "esquerda";
    if (cond === "esq_esquadria_dir") return effectiveHinge === "direita";
  }

  return false;
}

// ── Gera BOM usando ty.bomConfig (se configurado) ou BOM_CONFIG (fallback) ─
function gerarRelatorioQuantitativo(panels) {
  const acc = {};
  const addItem = (nome, qty) => {
    nome = nome.trim();
    if (!acc[nome]) acc[nome] = { nome, qtd: 0, precoFinal: getPriceForType(nome) };
    acc[nome].qtd += qty;
  };

  // ── Pisos ──────────────────────────────────────────────────────────────
  panels.forEach(p => {
    const ty = typeOf(p.typeId);
    if (!ty) return;

    if (ty.bomConfig && ty.bomConfig.length > 0) {
      ty.bomConfig.forEach(row => {
        if (row.condicao === 'piso_com_quina') {
          // Multiplica pela quantidade de quinas ativas nesta instância
          const c = p.corners || {};
          const nQuinas = [c.tl, c.tr, c.bl, c.br].filter(Boolean).length;
          if (nQuinas > 0) addItem(row.produtoNome, (row.qty || 1) * nQuinas);
        } else if (avaliarCondicaoBOM(row.condicao, p)) {
          addItem(row.produtoNome, row.qty || 1);
        }
      });
    } else {
      const bomFn = BOM_CONFIG[ty.name];
      if (bomFn) {
        bomFn(p, ty).forEach(item => addItem(item.nome, item.qty));
      } else {
        addItem(ty.name, 1);
      }
    }
    // (oitão: contabilizado via condição "oitao_ativo" no bomConfig do tipo)
  });

  // ── Paredes (wallInstances) ────────────────────────────────────────────
  (state.wallInstances || []).forEach(wi => {
    const wt = wallTypeOf(wi.wallTypeId);
    if (!wt) return;
    if (wt.bomConfig && wt.bomConfig.length > 0) {
      wt.bomConfig.forEach(row => {
        if (avaliarCondicaoBOM(row.condicao, wi)) {
          addItem(row.produtoNome, row.qty || 1);
        }
      });
    } else {
      // Fallback: usa o nome do tipo de parede como produto
      addItem(wt.name, 1);
    }
  });

  // ── Insumos complementares por franquia (Ponto 5) ──────────────────────
  // Cada insumo é agrupado por NOME apenas (independente de quantos painéis
  // diferentes o usam) — uma única linha por insumo em toda a planta.
  const insumoOrigens = {}; // nome do insumo -> Set com os nomes dos painéis que o usam
  Object.values(acc).slice().forEach(entry => {
    const relacionados = insumosMap[chaveCatalogo(entry.nome)];
    if (!relacionados || !relacionados.length) return;
    relacionados.forEach(ins => {
      const key = `insumo::${ins.nome}`;
      if (!acc[key]) {
        acc[key] = { nome: ins.nome, qtd: 0, precoFinal: ins.precoFinal, isInsumo: true };
        insumoOrigens[ins.nome] = new Set();
      }
      acc[key].qtd += entry.qtd * (ins.qty||1);
      insumoOrigens[ins.nome].add(entry.nome);
    });
  });
  // Ponto 4: soma total de cada insumo arredondada para cima (inteiro mais
  // próximo acima) — o subtotal é calculado sobre esse valor já arredondado.
  Object.values(acc).filter(e => e.isInsumo).forEach(e => {
    e.qtd = Math.ceil(e.qtd);
    e.origens = Array.from(insumoOrigens[e.nome] || []);
  });

  const prodList = pricingData?.produtos || [];
  return Object.values(acc)
    .map(g => ({
      ...g,
      temPreco: g.precoFinal !== null && g.precoFinal > 0,
      subtotal: (g.precoFinal || 0) * g.qtd,
    }))
    .sort((a, b) => {
      // Insumos ficam sempre agrupados ao final da lista, depois de todos
      // os produtos/painéis; entre si, ordenados alfabeticamente.
      if (a.isInsumo || b.isInsumo) {
        if (a.isInsumo && b.isInsumo) return a.nome.localeCompare(b.nome, 'pt-BR');
        return a.isInsumo ? 1 : -1;
      }
      const ia = prodList.findIndex(p => p.nome === a.nome);
      const ib = prodList.findIndex(p => p.nome === b.nome);
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    });
}

// ── Aplica ajustes manuais e novos itens sobre o BOM automático ──────────
function gerarItensOrcamento() {
  const base = gerarRelatorioQuantitativo(state.panels);
  const baseNomes = new Set(base.map(b => b.nome));

  const itens = base.map(item => {
    const delta      = qAjustes[item.nome] || 0;
    const qtdFinal   = Math.max(0, item.qtd + delta);
    const acrescimo  = qPrecoAjustes[item.nome] || 0;
    const precoFinal = (item.precoFinal || 0) + acrescimo;
    return { ...item, delta, qtdFinal, precoFinal, acrescimo, temPreco: precoFinal > 0, subtotal: precoFinal * qtdFinal, isNovoItem: false };
  });

  // Itens adicionados manualmente que não existem no BOM automático
  qNovosItens.forEach(nome => {
    if (baseNomes.has(nome)) return; // já está no BOM, ajuste vai aparecer lá
    const delta = qAjustes[nome] || 0;
    if (delta <= 0) { qNovosItens.delete(nome); return; }
    const acrescimo = qPrecoAjustes[nome] || 0;
    const precoFinal = (getPriceForType(nome) || 0) + acrescimo;
    itens.push({
      nome, qtd: 0, delta, qtdFinal: delta,
      precoFinal, acrescimo, temPreco: precoFinal > 0,
      subtotal: precoFinal * delta, isNovoItem: true,
    });
  });

  // Insumos adicionados manualmente (não vinculados a nenhum painel da planta)
  qNovosInsumos.forEach(nome => {
    if (baseNomes.has(nome)) return; // já está no BOM, ajuste vai aparecer lá
    const delta = qAjustes[nome] || 0;
    if (delta <= 0) { qNovosInsumos.delete(nome); return; }
    const acrescimo = qPrecoAjustes[nome] || 0;
    const precoFinal = (getPriceForInsumo(nome) || 0) + acrescimo;
    itens.push({
      nome, qtd: 0, delta, qtdFinal: delta,
      precoFinal, acrescimo, temPreco: precoFinal > 0,
      subtotal: precoFinal * delta, isNovoItem: true,
      isInsumo: true, origens: [],
    });
  });

  return itens.filter(i => i.qtdFinal > 0);
}

// ── Ponto 6: lista de insumos para a aba "Insumos" do Quantitativo.
// gerarItensOrcamento() já entrega os insumos agrupados por nome (Ponto 4),
// então aqui só filtramos e ordenamos.
function gerarInsumosAgregados() {
  return gerarItensOrcamento()
    .filter(it => it.isInsumo)
    .map(it => ({ ...it, origens: it.origens || [] }))
    .sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

// Um insumo é considerado "Compra com Indústria" (aparece no PDF) por padrão,
// a menos que tenha sido explicitamente desmarcado.
function insumoCompraIndustria(nome) {
  return state.insumoCompraIndustria?.[nome] !== false;
}
function qToggleCompraIndustria(nome, checked) {
  state.insumoCompraIndustria = state.insumoCompraIndustria || {};
  state.insumoCompraIndustria[nome] = checked;
}
function qSetViewTab(tab) {
  qViewTab = tab;
  abrirQuantitativo();
}

// ── Abre o modal de quantitativo ─────────────────────────────
function abrirQuantitativo() {
  if (!pricingData) {
    toastError("Aguardando autenticação. Recarregue a página com um token válido.");
    return;
  }

  // Preserva a posição do scroll ao reabrir o modal (ex: depois de clicar em
  // +/− numa quantidade) — sem isso a tela voltava pro topo a cada clique.
  const _prevScrollModal = modalBody.scrollTop;
  const _prevScrollTable = document.querySelector('.q-table-wrap')?.scrollTop || 0;

  const itens      = gerarItensOrcamento();
  // Aba "Painéis" só deve exibir itens que não são insumos — insumos ficam
  // exclusivamente na aba "Insumos" (tabela agrupada própria mais abaixo).
  const itensPaineis = itens.filter(it => !it.isInsumo);
  const semPreco   = itensPaineis.filter(i => !i.temPreco && !i.isNovoItem);
  const valorTotal = itens.reduce((s, i) => s + (i.subtotal || 0), 0);
  const totalPaineis = state.panels.length;
  const totalArea    = state.panels.reduce((s,p)=>{ const ty=typeOf(p.typeId); return s+(ty&&!ty.isStair?ty.w*ty.d:0);},0);
  const brlFmt = v => v.toLocaleString('pt-BR', {minimumFractionDigits:2,maximumFractionDigits:2});

  const perfilBadge = `<span class="q-margem-badge">
    ${(pricingData.perfil === 'Gestor' || pricingData.perfil === 'Gestor Matriz') ? '👔' : '🛒'} <b>${pricingData.perfil}</b>
    &nbsp;·&nbsp; ${esc(pricingData.franquia)}
  </span>`;

  const rows = itensPaineis.map(it => {
    const prCell = it.temPreco
      ? `<span class="q-preco-cell">R$ ${brlFmt(it.precoFinal)}</span>`
      : `<span class="q-sem-preco">—</span>`;
    const stCell = it.temPreco
      ? `<b>R$ ${brlFmt(it.subtotal)}</b>`
      : `<span class="q-sem-preco">sem preço</span>`;
    const deltaStr = it.delta !== 0
      ? `<span class="q-delta">${it.delta > 0 ? '+' : ''}${it.delta}</span>` : '';
    // Todos os itens (automáticos e manuais) têm +/− e também um campo pra
    // digitar diretamente a quantidade final desejada.
    const adjBtns = `<span class="q-adj">
        <button data-planta-q-adjust="${esc(it.nome)}" data-planta-q-delta="-1" title="−1">−</button>
        <input type="number" class="q-qty-input" min="0" step="1" value="${it.qtdFinal}"
          data-planta-q-set="${esc(it.nome)}" data-planta-q-base="${it.qtd}"
          data-planta-enter-commit="true"
          title="Digite a quantidade final desejada">
        ${deltaStr}
        <button data-planta-q-adjust="${esc(it.nome)}" data-planta-q-delta="1" title="+1">+</button>
      </span>`;
    // Acréscimo manual de valor — disponível para QUALQUER perfil (Admin,
    // Gestor ou Vendedor), sempre >= 0 (só permite cobrar a mais neste
    // orçamento específico, nunca reduzir o preço de tabela do item).
    const acrescimo = it.acrescimo || 0;
    const precoAdj = `<div class="q-preco-adj" title="Acrescentar valor a este item neste orçamento (somente para mais — não reduz o preço de tabela)">
        <span class="q-preco-adj-label">+R$</span>
        <input type="number" class="q-preco-adj-input" min="0" step="0.01"
          value="${acrescimo>0?acrescimo:''}" placeholder="0,00"
          data-planta-q-price="${esc(it.nome)}"
          data-planta-enter-commit="true">
      </div>`;
    const novoLabel = it.isNovoItem
      ? '<div class="q-dims" data-planta-style="planta-inline-082">adicionado manualmente</div>' : '';
    // Ponto 4: insumo complementar — já vem agrupado (uma linha por insumo,
    // mesmo que usado em vários painéis); mostra em quais painéis é usado.
    const insumoLabel = it.isInsumo
      ? `<div class="q-dims" data-planta-style="planta-inline-083">usado em: ${(it.origens||[]).map(o=>esc(o)).join(', ')}</div>` : '';
    const rowClasses = [
      it.temPreco ? '' : 'q-no-preco-row',
      it.isInsumo ? 'q-insumo-row' : '',
    ].filter(Boolean).join(' ');
    return `<tr class="${rowClasses}">
      <td><div class="q-type-name" data-planta-insumo-style="${it.isInsumo ? 'yes' : 'no'}">${it.isInsumo ? '↳ ' : ''}${esc(it.nome)}</div>${novoLabel}${insumoLabel}</td>
      <td class="num">${adjBtns}</td>
      <td class="num">${prCell}${precoAdj}</td>
      <td class="num">${stCell}</td>
    </tr>`;
  }).join('');

  const warn = semPreco.length
    ? `<div class="q-warn">⚠ <b>${semPreco.length}</b> tipo(s) sem preço: ${semPreco.map(i=>`<em>${esc(i.nome)}</em>`).join(', ')}.</div>`
    : '';

  // ── Bloco de desconto + totais ────────────────────────────
  const descValorAbs = qDesconto.tipo === 'percent'
    ? valorTotal * (qDesconto.valor / 100)
    : Math.min(qDesconto.valor, valorTotal);
  const valorFinal = Math.max(0, valorTotal - descValorAbs);

  const totalBlock = valorTotal > 0 ? `
    <div class="q-total-block">
      <span class="q-total-label">Subtotal</span>
      <span class="q-total-val">R$ ${brlFmt(valorTotal)}</span>
    </div>
    <div class="q-desconto-block">
      <label>Desconto</label>
      <div class="q-desc-inputs">
        <select id="q_desc_tipo" data-planta-apply-discount="true">
          <option value="percent" ${qDesconto.tipo==='percent'?'selected':''}>%</option>
          <option value="reais"   ${qDesconto.tipo==='reais'  ?'selected':''}>R$</option>
        </select>
        <input type="number" id="q_desc_val" min="0" step="0.01"
          value="${qDesconto.valor > 0 ? qDesconto.valor : ''}"
          placeholder="0"
          data-planta-apply-discount="true"
          data-planta-enter-commit="true">
      </div>
      <span class="q-desc-val">${descValorAbs > 0 ? '− R$ ' + brlFmt(descValorAbs) : '—'}</span>
    </div>
    <div class="q-final-block">
      <span class="q-final-label">Valor Final</span>
      <span class="q-final-val">R$ ${brlFmt(valorFinal)}</span>
    </div>` : '';

  // Avulso section — botão "Adicionar" com inteiros
  const prodOpts = (pricingData?.produtos||[]).map(p=>`<option value="${esc(p.nome)}">${esc(p.nome)}</option>`).join('');
  const avulsoSection = `
    <div class="q-avulso-section">
      <div class="q-avulso-title">➕ Adicionar produto</div>
      <div class="q-avulso-row">
        <select id="q_avulso_prod">${prodOpts}</select>
        <input type="number" id="q_avulso_qty" value="1" min="1" step="1" data-planta-style="planta-inline-084">
        <button class="tbtn" data-planta-action="add-avulso">Adicionar</button>
      </div>
    </div>`;

  // Botão ⚙ discreto — só aparece para Gestor, empurrado para a esquerda
  const confBtn = (pricingData.podeEditar)
    ? `<button class="tbtn q-conf-btn" data-planta-action="open-margins" title="Configurações de margens">⚙</button>`
    : '';
  const insumosBtn = (pricingData.podeEditar)
    ? `<button class="tbtn q-conf-btn" data-planta-action="open-insumos" title="Configurar custos de insumos complementares">🧩</button>`
    : '';

  // ── Ponto 6: aba "Insumos" — lista agrupada com checkbox "Compra com Indústria"
  const insumosAgg = gerarInsumosAgregados();
  const insumosRows = insumosAgg.map(ins => {
    const checked = insumoCompraIndustria(ins.nome);
    const nomeAttr = esc(ins.nome).replace(/"/g,'&quot;');
    const insDeltaStr = ins.delta !== 0
      ? `<span class="q-delta">${ins.delta > 0 ? '+' : ''}${ins.delta}</span>` : '';
    const insAdjBtns = `<span class="q-adj">
        <button data-planta-q-adjust="${esc(ins.nome)}" data-planta-q-delta="-1" title="−1">−</button>
        <input type="number" class="q-qty-input" min="0" step="1" value="${ins.qtdFinal}"
          data-planta-q-set="${esc(ins.nome)}" data-planta-q-base="${ins.qtd}"
          data-planta-enter-commit="true"
          title="Digite a quantidade final desejada">
        ${insDeltaStr}
        <button data-planta-q-adjust="${esc(ins.nome)}" data-planta-q-delta="1" title="+1">+</button>
      </span>`;
    const insOrigemLabel = ins.origens.length
      ? `<div class="q-dims" data-planta-style="planta-inline-083">usado em: ${ins.origens.map(o=>esc(o)).join(', ')}</div>`
      : `<div class="q-dims" data-planta-style="planta-inline-082">adicionado manualmente</div>`;
    return `<tr>
      <td class="num" data-planta-style="planta-inline-085">
        <input type="checkbox" ${checked?'checked':''} title="Compra com Indústria — aparece no PDF"
          data-planta-toggle-industria="${nomeAttr}">
      </td>
      <td>
        <div class="q-type-name">${esc(ins.nome)}</div>
        ${insOrigemLabel}
      </td>
      <td class="num">${insAdjBtns}</td>
      <td class="num">${ins.precoFinal>0?`R$ ${brlFmt(ins.precoFinal)}`:`<span class="q-sem-preco">—</span>`}</td>
      <td class="num"><b>R$ ${brlFmt(ins.subtotal)}</b></td>
    </tr>`;
  }).join('');

  // Avulso de insumos — adiciona insumos do catálogo geral da franquia que
  // ainda não estão presentes na planta (não vinculados a nenhum painel).
  const insumoOpts = (pricingData?.insumosCatalog||[]).map(i=>`<option value="${esc(i.nome)}">${esc(i.nome)}</option>`).join('');
  const avulsoInsumoSection = insumoOpts ? `
    <div class="q-avulso-section">
      <div class="q-avulso-title">➕ Adicionar insumo</div>
      <div class="q-avulso-row">
        <select id="q_avulso_insumo">${insumoOpts}</select>
        <input type="number" id="q_avulso_insumo_qty" value="1" min="1" step="1" data-planta-style="planta-inline-084">
        <button class="tbtn" data-planta-action="add-insumo-avulso">Adicionar</button>
      </div>
    </div>` : '';

  const viewTabsHtml = `
    <div class="q-viewtabs">
      <button class="q-viewtab ${qViewTab==='paineis'?'on':''}" data-planta-action="view-panels">📦 Painéis</button>
      <button class="q-viewtab ${qViewTab==='insumos'?'on':''}" data-planta-action="view-insumos">🧩 Insumos${insumosAgg.length?` (${insumosAgg.length})`:''}</button>
    </div>`;

  modalBody.classList.add('q-wide');
  modalBody.dataset.modal = "quantitativo"; // marca qual modal está aberto (evita hijack pelo polling de preços)
  modalBody.innerHTML = `
    <div class="q-modal">
      <div class="q-header">
        <h3>📊 Quantitativo &amp; Orçamento</h3>
        <div class="q-session">${perfilBadge}</div>
        <div class="q-summary">
          <span><b>${totalPaineis}</b> painel(s)</span>
          <span><b>${itens.length}</b> tipo(s)</span>
          <span><b>${fmt(totalArea)} m²</b></span>
          ${semPreco.length ? `<span data-planta-style="planta-inline-086"><b>${semPreco.length}</b> sem preço</span>` : ''}
        </div>
        ${viewTabsHtml}
      </div>
      <div class="q-scroll-mid">
      ${qViewTab==='insumos' ? `
        ${insumosRows ? `
          <div class="q-table-wrap">
            <table class="q-table">
              <thead><tr>
                <th data-planta-style="planta-inline-085">Compra c/ Indústria</th>
                <th>Insumo</th>
                <th class="num">Qtd.</th>
                <th class="num">Custo Unit.</th>
                <th class="num">Subtotal</th>
              </tr></thead>
              <tbody>${insumosRows}</tbody>
            </table>
          </div>
          <p class="sub" data-planta-style="planta-inline-087">Insumos desmarcados não aparecem no PDF, mas continuam somando no valor total do orçamento.</p>
          ${totalBlock}
        ` : `<p data-planta-style="planta-inline-088">Nenhum insumo complementar cadastrado para os painéis desta planta.</p>`}
        ${avulsoInsumoSection}
      ` : `
      ${rows ? `
        <div class="q-table-wrap">
          <table class="q-table">
            <thead><tr>
              <th>Produto / Tipo</th>
              <th class="num">Qtd. <span data-planta-style="planta-inline-089">(auto ± ajuste)</span></th>
              <th class="num">Preço Unit.</th>
              <th class="num">Subtotal</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${warn}${totalBlock}
      ` : `<p data-planta-style="planta-inline-088">Nenhum painel na planta ainda.</p>`}
      ${avulsoSection}
      `}
      </div>
      <div class="modal-actions" data-planta-style="planta-inline-090">
        ${confBtn}
        ${insumosBtn}
        <button class="tbtn" data-planta-action="clear-adjustments">Limpar ajustes</button>
        <button class="tbtn" data-planta-pdf="preview">⤓ Pré-visualizar</button>
        <button class="tbtn" data-planta-pdf="save">⤓ PDF</button>
        <button class="tbtn primary" data-planta-action="close-modal">Fechar</button>
      </div>
    </div>`;

  document.getElementById("scrim").classList.add("show");

  // Restaura a posição do scroll capturada no início da função.
  modalBody.scrollTop = _prevScrollModal;
  const _tableWrap = document.querySelector('.q-table-wrap');
  if (_tableWrap) _tableWrap.scrollTop = _prevScrollTable;
}

// Ajusta qty de um item e remove item manual zerado
function qAjustarQtd(nome, delta) {
  qAjustes[nome] = (qAjustes[nome] || 0) + delta;
  // Se item manual (produto ou insumo) foi zerado, limpa da lista
  if ((qNovosItens.has(nome) || qNovosInsumos.has(nome)) && (qAjustes[nome] || 0) <= 0) {
    qNovosItens.delete(nome);
    qNovosInsumos.delete(nome);
    delete qAjustes[nome];
  }
  abrirQuantitativo();
}

// Define a quantidade final de um item digitando um número específico
// (em vez de só poder ir de 1 em 1 nos botões +/−). baseQtd é a quantidade
// automática (item.qtd, antes de qualquer ajuste manual) — o delta salvo em
// qAjustes é sempre relativo a ela, então recalculamos: delta = novoValor − baseQtd.
function qDefinirQtd(nome, baseQtd, valorStr) {
  let v = parseInt(String(valorStr).replace(',', '.'), 10);
  if (!isFinite(v) || v < 0) v = 0;
  const delta = v - (baseQtd || 0);
  if (delta === 0) delete qAjustes[nome]; else qAjustes[nome] = delta;
  // Se item manual (produto ou insumo) foi zerado, limpa da lista
  if ((qNovosItens.has(nome) || qNovosInsumos.has(nome)) && v <= 0) {
    qNovosItens.delete(nome);
    qNovosInsumos.delete(nome);
    delete qAjustes[nome];
  }
  abrirQuantitativo();
}

// Acrescenta valor (R$) ao preço de um item específico, neste orçamento.
// Disponível para QUALQUER perfil (Admin, Gestor ou Vendedor) — mas SÓ
// PARA MAIS: qualquer valor negativo ou inválido é travado em 0, nunca
// reduz o preço de tabela do item.
function qAjustarPreco(nome, valorStr) {
  let v = parseFloat(String(valorStr).replace(',', '.'));
  if (!isFinite(v) || v < 0) v = 0;
  v = Math.round(v * 100) / 100;
  if (v > 0) qPrecoAjustes[nome] = v; else delete qPrecoAjustes[nome];
  abrirQuantitativo();
}

// Lê os controles de desconto do modal e actualiza qDesconto,
// depois re-abre o modal para reflectir o novo valor final.
function qAplicarDesconto() {
  const tipoEl = document.getElementById('q_desc_tipo');
  const valEl  = document.getElementById('q_desc_val');
  if (!tipoEl || !valEl) return;
  qDesconto.tipo  = tipoEl.value;
  qDesconto.valor = Math.max(0, parseFloat(valEl.value) || 0);
  abrirQuantitativo();
}

// Adiciona produto com mesclagem inteligente:
//   • Se já existe na tabela → soma ao ajuste da linha existente
//   • Se é novo → cria na tabela com os mesmos botões +/−
function qAdicionarAvulso() {
  const sel = document.getElementById('q_avulso_prod');
  const qty = Math.max(1, parseInt(document.getElementById('q_avulso_qty')?.value, 10) || 1);
  if (!sel || !sel.value) return;
  const nome = sel.value;

  const base = gerarRelatorioQuantitativo(state.panels);
  const existeNoBOM   = base.some(b => b.nome === nome);
  const existeManual  = qNovosItens.has(nome);

  if (existeNoBOM || existeManual) {
    // Mescla: adiciona ao ajuste da linha já existente
    qAjustes[nome] = (qAjustes[nome] || 0) + qty;
  } else {
    // Novo produto: rastreia e define qty inicial
    qNovosItens.add(nome);
    qAjustes[nome] = (qAjustes[nome] || 0) + qty;
  }
  abrirQuantitativo();
}

// Adiciona insumo avulso (não vinculado a nenhum painel da planta), com a
// mesma mesclagem inteligente do qAdicionarAvulso (produtos).
function qAdicionarInsumoAvulso() {
  const sel = document.getElementById('q_avulso_insumo');
  const qty = Math.max(1, parseInt(document.getElementById('q_avulso_insumo_qty')?.value, 10) || 1);
  if (!sel || !sel.value) return;
  const nome = sel.value;

  const base = gerarRelatorioQuantitativo(state.panels);
  const existeNoBOM  = base.some(b => b.nome === nome);
  const existeManual = qNovosInsumos.has(nome);

  if (existeNoBOM || existeManual) {
    // Mescla: adiciona ao ajuste da linha já existente
    qAjustes[nome] = (qAjustes[nome] || 0) + qty;
  } else {
    // Novo insumo: rastreia e define qty inicial
    qNovosInsumos.add(nome);
    qAjustes[nome] = (qAjustes[nome] || 0) + qty;
  }
  abrirQuantitativo();
}

// Zera todos os ajustes e itens manuais
function qLimparAjustes() {
  qAjustes = {}; qNovosItens = new Set(); qNovosInsumos = new Set();
  qPrecoAjustes = {};
  qDesconto = { tipo: 'percent', valor: 0 };
  abrirQuantitativo();
}

// Abre o modal isolado de configuração de margens (apenas para Gestor)
function abrirConfigMargens() {
  if (!pricingData?.podeEditar || !pricingData.aliquotas) return;
  const overlay = document.getElementById('gestorOverlay');
  const body    = document.getElementById('gestorModalBody');

  // ── Passo 1: tela de confirmação ────────────────────────────────────────
  body.innerHTML = `
    <div class="gc-confirm">
      <span class="gc-warn-icon">⚠️</span>
      <h3>Editar margens gerenciais?</h3>
      <p>Você está prestes a visualizar e alterar<br>as margens de lucro e alíquotas.</p>
      <div class="gc-btns">
        <button class="gc-btn-nao" id="gc_nao">Não, voltar</button>
        <button class="gc-btn-sim" id="gc_sim">Sim, continuar</button>
      </div>
    </div>`;

  document.getElementById('gc_nao').onclick = () => overlay.classList.remove('show');
  document.getElementById('gc_sim').onclick = () => mostrarEditorMargens();

  overlay.classList.add('show');
  overlay.onclick = e => { if (e.target === overlay) overlay.classList.remove('show'); };
}

// ── Passo 2: editor de margens (abre só após confirmação) ─────────────────
function mostrarEditorMargens() {
  if (!pricingData?.aliquotas) return;
  const al      = pricingData.aliquotas;
  const overlay = document.getElementById('gestorOverlay');

  document.getElementById('gestorModalBody').innerHTML = `
    <h3 data-planta-style="planta-inline-091">⚙ Margens — ${esc(pricingData.franquia)}</h3>
    <div data-planta-style="planta-inline-092">

      <!-- Coluna: Margens -->
      <div data-planta-style="planta-inline-093">
        <div data-planta-style="planta-inline-094">
          <span data-planta-style="planta-inline-095">M. Lucro Gestor</span>
          <div data-planta-style="planta-inline-096">
            <input class="q-gp-input" id="gc_mg" type="number" min="0" max="999" step="0.5" value="${al.margemGestor.toFixed(2)}">
            <span class="q-gp-unit">%</span>
          </div>
        </div>
        <div data-planta-style="planta-inline-094">
          <span data-planta-style="planta-inline-095">M. Lucro Vendedores</span>
          <div data-planta-style="planta-inline-096">
            <input class="q-gp-input" id="gc_mv" type="number" min="0" max="999" step="0.5" value="${al.margemVendedor.toFixed(2)}">
            <span class="q-gp-unit">%</span>
          </div>
        </div>
      </div>

      <!-- Divisor vertical -->
      <div data-planta-style="planta-inline-097"></div>

      <!-- Coluna: Royalties + Imposto -->
      <div data-planta-style="planta-inline-093">
        <div data-planta-style="planta-inline-094">
          <span data-planta-style="planta-inline-095">Royalties</span>
          <div data-planta-style="planta-inline-096">
            <input class="q-gp-input" id="gc_roy" type="number" min="0" max="999" step="0.5" value="${al.royalties.toFixed(2)}">
            <span class="q-gp-unit">%</span>
          </div>
        </div>
        <div data-planta-style="planta-inline-094">
          <span data-planta-style="planta-inline-095">Imposto</span>
          <div data-planta-style="planta-inline-096">
            <input class="q-gp-input" id="gc_imp" type="number" min="0" max="99.9" step="0.5" value="${al.imposto.toFixed(2)}">
            <span class="q-gp-unit">%</span>
          </div>
        </div>
      </div>

    </div>
    <div class="q-gp-status" id="gc_status" data-planta-style="planta-inline-098"></div>
    <div class="modal-actions">
      <button class="tbtn" data-planta-action="close-gestor">Cancelar</button>
      <button class="tbtn primary" id="gc_salvar">Salvar Margens</button>
    </div>`;

  document.getElementById('gc_salvar').onclick = async () => {
    const mg  = parseFloat(document.getElementById("gc_mg").value);
    const mv  = parseFloat(document.getElementById("gc_mv").value);
    const imp = parseFloat(document.getElementById("gc_imp").value);
    const roy = parseFloat(document.getElementById("gc_roy").value);
    const status = document.getElementById("gc_status");
    status.textContent = "";
    if ([mg,mv,imp,roy].some(v=>isNaN(v)||v<0)){status.textContent="⚠ Valores inválidos.";status.style.color="#c62828";return;}
    if(imp>=100){status.textContent="⚠ Imposto não pode ser ≥100%.";status.style.color="#c62828";return;}
    const btn = document.getElementById("gc_salvar");
    btn.disabled=true; btn.textContent="Salvando…";
    const token = tokenAtivoSessao;
    if (!token) { status.textContent = "⚠ Erro: Token de autenticação não encontrado."; status.style.color = "#c62828"; return; }
    let data;
    try {
      data = await callRPC("salvar_margens", { p_token: token, p_mg: mg, p_mv: mv, p_imp: imp, p_roy: roy });
    } catch(fetchErr) {
      // Erro de rede/conexão com o Supabase
      status.textContent = `⚠ Erro de rede: ${fetchErr.message}`;
      status.style.color = "#c62828";
      btn.disabled=false; btn.textContent="Salvar Margens";
      return;
    }
    try {
      if(data.ok){
        status.textContent="✓ Salvo! Atualizando valores…"; status.style.color="#2e7d32";
        // Puxa os valores atualizados da base (server-truth, não otimista)
        recarregarPrecos({silent:true});
        setTimeout(()=>overlay.classList.remove('show'), 1200);
      } else {
        status.textContent = `⚠ ${data.erro||"Erro ao salvar."}`;
        status.style.color = "#c62828";
      }
    } catch(jsonErr) {
      status.innerHTML = `⚠ Erro inesperado: <small>${esc(jsonErr.message)}</small>`;
      status.style.color = "#c62828";
    }
    btn.disabled=false; btn.textContent="Salvar Margens";
  };
}

// ════════════════════════════════════════════════════════════════════════
// CONFIGURAR INSUMOS — Gestor/Admin ajustam o custo de cada insumo
// complementar para a própria franquia (Ponto 5)
// ════════════════════════════════════════════════════════════════════════

// Abre o modal isolado de configuração de insumos (apenas para Gestor/Admin)
function abrirConfigInsumos() {
  if (!pricingData?.podeEditar) return;
  const overlay = document.getElementById('gestorOverlay');
  const body    = document.getElementById('gestorModalBody');

  // ── Passo 1: tela de confirmação (mesmo padrão da tela de margens) ──────
  body.innerHTML = `
    <div class="gc-confirm">
      <span class="gc-warn-icon">🧩</span>
      <h3>Editar custos de insumos?</h3>
      <p>Você está prestes a visualizar e alterar<br>os custos de insumos complementares desta franquia.</p>
      <div class="gc-btns">
        <button class="gc-btn-nao" id="gci_nao">Não, voltar</button>
        <button class="gc-btn-sim" id="gci_sim">Sim, continuar</button>
      </div>
    </div>`;

  document.getElementById('gci_nao').onclick = () => overlay.classList.remove('show');
  document.getElementById('gci_sim').onclick = () => mostrarEditorInsumos();

  overlay.classList.add('show');
  overlay.onclick = e => { if (e.target === overlay) overlay.classList.remove('show'); };
}

// ── Passo 2: editor de insumos (abre só após confirmação) ─────────────────
function mostrarEditorInsumos() {
  const overlay  = document.getElementById('gestorOverlay');
  const catalogo = pricingData?.insumosCatalog || [];
  const brlFmt   = v => Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

  const rows = catalogo.length ? catalogo.map((ins,i) => `
    <tr>
      <td><div class="q-type-name">${esc(ins.nome)}</div></td>
      <td class="num">
        <div data-planta-style="planta-inline-099">
          <span data-planta-style="planta-inline-100">R$</span>
          <input class="q-gp-input" data-insumo-i="${i}" type="number" min="0" step="0.01"
            value="${ins.custoBase>0?ins.custoBase.toFixed(2):''}" placeholder="0,00" data-planta-style="planta-inline-101">
        </div>
      </td>
      <td class="num" data-planta-style="planta-inline-102">R$ ${brlFmt(ins.precoFinal)}</td>
    </tr>`).join('') : '';

  document.getElementById('gestorModalBody').innerHTML = `
    <h3 data-planta-style="planta-inline-103">🧩 Custos de Insumos — ${esc(pricingData.franquia)}</h3>
    <p class="sub" data-planta-style="planta-inline-104">Custo base por insumo. O preço de venda é calculado automaticamente com as mesmas margens/alíquotas dos produtos.</p>
    ${rows ? `
      <div class="q-table-wrap" data-planta-style="planta-inline-105">
        <table class="q-table">
          <thead><tr>
            <th>Insumo</th>
            <th class="num">Custo Base</th>
            <th class="num">Preço de Venda</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    ` : `<p data-planta-style="planta-inline-106">
        Nenhum insumo cadastrado ainda.<br>
        <span data-planta-style="planta-inline-066">Cadastre pares Painel/Insumo na aba "Insumos por Painel" da planilha.</span>
      </p>`}
    <div class="q-gp-status" id="gci_status" data-planta-style="planta-inline-098"></div>
    <div class="modal-actions">
      <button class="tbtn" data-planta-action="close-gestor">Cancelar</button>
      ${rows ? `<button class="tbtn primary" id="gci_salvar">Salvar Custos</button>` : ''}
    </div>`;

  if (!rows) return;

  document.getElementById('gci_salvar').onclick = async () => {
    const status = document.getElementById("gci_status");
    status.textContent = "";
    const lista = [];
    let temInvalido = false;
    document.querySelectorAll('[data-insumo-i]').forEach(inp => {
      const i = parseInt(inp.dataset.insumoI, 10);
      const nome = catalogo[i]?.nome;
      const raw = inp.value.trim();
      if (raw === "") return; // deixa como está (não sobrescreve com 0 sem intenção)
      const custo = parseFloat(raw);
      if (!nome || isNaN(custo) || custo < 0) { temInvalido = true; return; }
      lista.push({ nome, custo });
    });
    if (temInvalido) { status.textContent = "⚠ Há valores inválidos."; status.style.color = "#c62828"; return; }
    if (!lista.length) { status.textContent = "Nenhuma alteração para salvar."; status.style.color = "var(--ink-faint)"; return; }

    const btn = document.getElementById("gci_salvar");
    btn.disabled=true; btn.textContent="Salvando…";
    const token = tokenAtivoSessao;
    if (!token) { status.textContent = "⚠ Erro: Token de autenticação não encontrado."; status.style.color = "#c62828"; return; }
    let data;
    try {
      data = await callRPC("salvar_insumos", { p_token: token, p_insumos: lista });
    } catch(fetchErr) {
      status.textContent = `⚠ Erro de rede: ${fetchErr.message}`;
      status.style.color = "#c62828";
      btn.disabled=false; btn.textContent="Salvar Custos";
      return;
    }
    try {
      if(data.ok){
        status.textContent="✓ Salvo! Atualizando valores…"; status.style.color="#2e7d32";
        await recarregarPrecos({silent:true});
        mostrarEditorInsumos(); // redesenha com os valores atualizados do servidor
      } else {
        status.textContent = `⚠ ${data.erro||"Erro ao salvar."}`;
        status.style.color = "#c62828";
        btn.disabled=false; btn.textContent="Salvar Custos";
      }
    } catch(jsonErr) {
      status.innerHTML = `⚠ Erro inesperado: <small>${esc(jsonErr.message)}</small>`;
      status.style.color = "#c62828";
      btn.disabled=false; btn.textContent="Salvar Custos";
    }
  };
}

// ── Autenticação via Token na URL ─────────────────────────────
async function autenticarECarregarToken() {
  const overlay  = document.getElementById("authOverlay");
  const spinner  = document.getElementById("authSpinner");
  const msg      = document.getElementById("authMsg");
  const form     = document.getElementById("authForm");
  const input    = document.getElementById("tokenInput");
  const btnOk    = document.getElementById("btnEntrar");
  const remember = document.getElementById("rememberToken");

  // ── Helpers de UI ───────────────────────────────────────────
  const showSpinner = (texto = "Autenticando…") => {
    form.style.display    = "none";
    msg.style.display     = "none";
    spinner.style.display = "";
    msg.innerHTML = texto;
  };
  const showForm = (errHTML = "") => {
    spinner.style.display = "none";
    form.style.display    = "";
    if (errHTML) {
      msg.innerHTML      = `<div class="auth-error">${errHTML}</div>`;
      msg.style.display  = "";
    } else {
      msg.style.display  = "none";
    }
    input.focus();
  };
  const unlockApp = () => {
    overlay.classList.add("hidden");
    setTimeout(() => { overlay.style.display = "none"; }, 450);
    renderInv();
    iniciarPollingPrecos(); // mantém preços/margens sincronizados enquanto o app fica aberto
    // Preenche chip de sessão no cabeçalho
    const perfil  = pricingData.perfil    || "—";
    const franquia= pricingData.franquia  || "—";
    const icon    = perfil === 'Admin'   ? '🏛️' :
                    (perfil === 'Gestor' || perfil === 'Gestor Matriz')  ? '👔' : '🛒';
    document.getElementById("userPerfilBadge").textContent = `${icon} ${perfil}`;
    document.getElementById("userFranquia").textContent    = franquia;
    document.getElementById("userInfoBar").style.display  = "flex";
    // Ponto 10: botões de exportar/importar JSON completo (estrutura toda,
    // incluindo cadastro de tipos) só ficam visíveis para o Admin.
    document.getElementById("jsonAdminBtns").style.display = (perfil === 'Admin') ? 'flex' : 'none';
  };

  // ── Núcleo de autenticação ──────────────────────────────────
  const autenticar = async (token, fromForm) => {
    tokenAtivoSessao = token; // guarda na sessão independente do checkbox
    showSpinner("Autenticando e carregando tabela de preços…");
    try {
      const data = await callRPC("autenticar", { p_token: token });

      if (!data.ok) {
        // Token inválido → limpa storage e volta ao form
        localStorage.removeItem("321modular_token");
        showForm(`⛔ ${esc(data.erro || "Token inválido.")} <small>Contate seu gestor.</small>`);
        return;
      }

      // ── Sucesso ──────────────────────────────────────────────
      // Salva no localStorage somente se o usuário veio pelo form e marcou "lembrar"
      if (fromForm && remember.checked) {
        localStorage.setItem("321modular_token", token);
      }
      aplicarPricingData(data);
      unlockApp();

    } catch (err) {
      localStorage.removeItem("321modular_token"); // descarta token possivelmente inválido
      showForm(`⚠ Falha de conexão: <small>${err.message}</small>`);
    }
  };

  // ── Passo 1: busca token no localStorage → fallback URL ─────
  const savedToken = localStorage.getItem("321modular_token") || "";
  const urlToken   = new URLSearchParams(location.search).get("token") || "";
  const autoToken  = savedToken || urlToken;

  if (autoToken) {
    // Passo 2: token encontrado → autentica direto, sem interação
    await autenticar(autoToken, false);
  } else {
    // Passo 3: sem token → exibe o formulário de login
    showForm();
  }

  // ── Wire do botão Conectar e tecla Enter ────────────────────
  btnOk.onclick = async () => {
    const t = input.value.trim();
    if (!t) { showForm("Por favor, digite seu token de acesso."); return; }
    await autenticar(t, true);
  };
  input.onkeydown = e => { if (e.key === "Enter") btnOk.click(); };
}

// ── Gera PDF do orçamento com assinatura ─────────────────────
function gerarPDFOrcamento(action = 'save') {
  if (!pricingData) { toastError("Sem dados de precificação."); return; }
  const { jsPDF } = window.jspdf;
  if (!jsPDF) { toastError("jsPDF não carregado."); return; }

  const doc    = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const brlFmt = v => "R$ " + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const itens  = gerarItensOrcamento();
  const total  = itens.reduce((s,i)=>s+(i.subtotal||0),0);
  const proj   = state.name || "Planta sem título";
  // Ponto 6: só entram na lista impressa os insumos marcados como
  // "Compra com Indústria" — o total continua somando todos os itens.
  const itensVisiveis = itens.filter(it => !it.isInsumo || insumoCompraIndustria(it.nome));

  // ── Calcular desconto ──────────────────────────────────────
  const descValorAbs = qDesconto.tipo === 'percent'
    ? total * (qDesconto.valor / 100)
    : Math.min(qDesconto.valor, total);
  const valorFinal = Math.max(0, total - descValorAbs);
  const temDesconto = descValorAbs > 0;

  // Converter SVG logo para PNG via canvas
  const img = document.getElementById("headerLogo");
  const cv = document.createElement("canvas");
  const cx = cv.getContext("2d");
  cv.width = 338 * 2; cv.height = 108 * 2; 
  cx.drawImage(img, 0, 0, cv.width, cv.height);
  const logoData = cv.toDataURL("image/png");

  // ── Cabeçalho e Design ────────────────────────────────────
  doc.setFillColor(31, 51, 27); // #1f331b
  doc.rect(0, 0, 210, 8, "F");
  doc.setFillColor(167, 199, 152); // #a7c798
  doc.rect(0, 8, 210, 2, "F");

  // Logo
  doc.addImage(logoData, "PNG", 14, 15, 45, 14.3);

  // Título
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 51, 27); // #1f331b
  doc.text("ORÇAMENTO", 196, 25, { align: "right" });
  
  // Informações do Projeto
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(32, 32, 32); // #202020
  doc.text(`Projeto: ${proj}`, 14, 40);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Franquia: ${pricingData.franquia}`, 14, 45);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 50);

  // Linha divisória
  doc.setDrawColor(208, 226, 200); // #d0e2c8
  doc.setLineWidth(0.5);
  doc.line(14, 54, 196, 54);

  // Painéis/produtos e insumos ficam em tabelas separadas no PDF.
  const paineisVisiveis = itensVisiveis.filter(it => !it.isInsumo);
  const insumosVisiveis = itensVisiveis.filter(it => it.isInsumo);

  const totaisFoot = (() => {
    if (temDesconto) {
      const descLabel = qDesconto.tipo === 'percent'
        ? `DESCONTO (${qDesconto.valor}%)`
        : 'DESCONTO';
      return [
        ["", "", "SUBTOTAL",    total > 0 ? brlFmt(total) : "—"],
        ["", "", descLabel,     brlFmt(descValorAbs)],
        ["", "", "TOTAL FINAL", valorFinal > 0 ? brlFmt(valorFinal) : "—"],
      ];
    }
    return [["", "", "TOTAL", total > 0 ? brlFmt(total) : "—"]];
  })();

  const tableBaseOpts = {
    styles: { 
        fontSize: 9, 
        cellPadding: 4, 
        textColor: [32, 32, 32], // #202020
        lineColor: [208, 226, 200], // #d0e2c8
        lineWidth: 0.1 
    },
    headStyles: { 
        fillColor: [31, 51, 27], // #1f331b
        textColor: 255, 
        fontStyle: "bold" 
    },
    alternateRowStyles: { 
        fillColor: [250, 252, 249] // Brancura sutil
    },
    footStyles: { 
        fillColor: [167, 199, 152], // #a7c798
        textColor: [31, 51, 27], // #1f331b
        fontStyle: "bold", 
        fontSize: 10 
    },
    didParseCell: function(data) {
      if (data.section === 'foot' && temDesconto) {
        if (data.row.index === 1) {
          // linha de desconto: fundo vermelho, texto branco, mesma fonte do rodapé
          data.cell.styles.fillColor  = [180, 30, 30];
          data.cell.styles.textColor  = [255, 255, 255];
        }
        if (data.row.index === 2) {
          // linha total final: verde escuro com texto branco
          data.cell.styles.fillColor  = [31, 51, 27];
          data.cell.styles.textColor  = [255, 255, 255];
          data.cell.styles.fontStyle  = 'bold';
          data.cell.styles.fontSize   = 11;
        }
      }
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 16 },
      2: { halign: "right",  minCellWidth: 44 },
      3: { halign: "right",  minCellWidth: 44 },
    },
  };

  // ── Tabela 1: Painéis / Produtos ──────────────────────────────────────
  doc.autoTable({
    startY: 60,
    head: [["Painéis / Produtos", "Qtd.", "Preço Unit.", "Subtotal"]],
    body: paineisVisiveis.length
      ? paineisVisiveis.map(it => [
          it.nome + (it.isAvulso ? ' ★' : ''),
          String(it.qtdFinal),
          it.temPreco ? brlFmt(it.precoFinal) : "—",
          it.temPreco ? brlFmt(it.subtotal)   : "—",
        ])
      : [["— nenhum painel —", "", "", ""]],
    // Só recebe o rodapé de totais aqui se não houver insumos a seguir.
    ...(insumosVisiveis.length ? {} : { foot: totaisFoot }),
    ...tableBaseOpts,
  });

  // ── Tabela 2: Insumos complementares ────────────────────────────────────
  if (insumosVisiveis.length) {
    doc.autoTable({
      startY: (doc.lastAutoTable?.finalY || 60) + 8,
      head: [["Insumos complementares", "Qtd.", "Preço Unit.", "Subtotal"]],
      body: insumosVisiveis.map(it => [
        it.nome,
        String(it.qtdFinal),
        it.temPreco ? brlFmt(it.precoFinal) : "—",
        it.temPreco ? brlFmt(it.subtotal)   : "—",
      ]),
      foot: totaisFoot,
      ...tableBaseOpts,
    });
  }

  const fname = `orcamento-${proj.replace(/\s+/g,"-").toLowerCase()}`;
  if (action === 'preview') {
    document.getElementById('previewFrame').src = doc.output('bloburl');
    document.getElementById('previewScrim').classList.add('show');
    document.getElementById('previewSaveBtn').onclick = () => { doc.save(fname+".pdf"); };
  } else {
    doc.save(fname+".pdf");
  }
}

// Wire the button
document.getElementById("btnQuant").addEventListener("click", ()=>{ qViewTab='paineis'; abrirQuantitativo(); });
// Botão Sair: apaga token salvo e recarrega a página para voltar ao login
const voltarParaPortal = () => {
  location.href = window.SuperAppAuth.getPortalUrl();
};
document.getElementById("btnLogout").addEventListener("click", voltarParaPortal);
document.getElementById("side-logout-planta").addEventListener("click", voltarParaPortal);
// Alterna entre tema claro/escuro e salva a escolha para as próximas sessões
document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("321modular_theme", "light"); } catch(e){}
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    try { localStorage.setItem("321modular_theme", "dark"); } catch(e){}
  }
});
/* ==========================================================================
   VISUALIZAÇÃO 3D — aba alternável (2D/3D) do stage.
   Isolado do restante do app: não reescreve nem depende de nenhuma lógica
   interna do editor 2D além dos helpers já existentes (typeOf, wallTypeOf,
   contentBBox, state.panels, state.wallInstances). Não usa/renomeia
   state.tabs/activeTab (isso é outro conceito — abas de projeto).
   ========================================================================== */

// ---- DOM refs -------------------------------------------------------------
const stage3dEl   = document.getElementById("stage3d");
const canvas3d    = document.getElementById("canvas3d");
const loading3dEl = document.getElementById("stage3dLoading");
const viewSwitchEl= document.getElementById("viewSwitch");

// ---- Estado interno do módulo 3D ------------------------------------------
let scene3D=null, camera3D=null, renderer3D=null, controls3D=null;
let panelsGroup3D=null, wallsGroup3D=null, groundMesh3D=null, blocksGroup3D=null, blockMaterial3D=null;
// Altura (m) onde o "chão" do chalé (piso/parede/mezanino/escada) começa —
// exatamente em cima do topo dos blocos de fundação (ver blocksGroup3D),
// que vão de y=0 até y=HOUSE_BASE_Y. Antes tudo começava em y=0 (flutuando
// dentro do bloco); agora cada modelo importado nasce já deslocado pra cá.
const HOUSE_BASE_Y = 0.5;
let sun3D=null;                 // referência à luz direcional (precisa pra reconfigurar sombras em runtime)
let clock3D=null;               // THREE.Clock — usado pro deltaTime do movimento WASD
let raf3D=null;                 // id do requestAnimationFrame ativo (loop só roda em modo 3D)
let sceneReady3D=false;         // true depois do initScene3D()
let resizeObserver3D=null;      // guardado pra poder desconectar em disposeScene3D()
let rebuildToken3D=0;           // evita corrida: uma reconstrução antiga não pisa numa mais nova

// Cenário externo: céu procedural (com sol) + árvores geradas ao redor da
// planta. Substituídos por um ambiente HDR de verdade se o usuário colar um
// link (ver applyHdrEnvironment3D). treesGroup3D é reconstruído a cada
// rebuildScene3D (depende do tamanho da planta); o céu é montado uma vez.
let skyGroup3D=null, sunSprite3D=null, treesGroup3D=null;
let hdrTexture3D=null, pmremGenerator3D=null;
let ambientLight3D=null; // referência à luz ambiente (pra reconfigurar a "iluminação global" em runtime)
let hemiLight3D=null;    // HemisphereLight (céu/chão) — parte da iluminação global (GI), dá o tom de cor do bounce
let fillLight3D=null;    // luz direcional secundária, sem sombra — evita duplicar sombras e só equilibra o céu

// Presets de textura por NOME — "sempre que uma textura com esse nome
// aparecer, aplica automaticamente estes ajustes" (matiz/saturação/
// luminosidade/rugosidade/reflexo). Persistido no JSON da planta (ver
// serialize()/load()). Chave = nome exato da textura (trim), valor =
// {hue,sat,light,rough,metal}. Independente da cena atual — pode conter
// nomes que nem apareceram ainda no projeto aberto.
//
// Agora separados por qualidade do modelo (Leve/Detalhado) — pedido
// explícito: a versão "achatada" (Flat Textures) de uma textura pode
// precisar de um ajuste bem diferente da versão 4k original, então cada
// qualidade guarda seu próprio conjunto de presets por nome.
// materialPresetsAll3D = { detalhado:{nome:preset}, leve:{nome:preset} }.
// materialPresets3D continua existindo, mas agora é só um ALIAS pro bucket
// da qualidade ATIVA na cena agora (render3DQuality) — é o que
// collectSceneMaterials3D/reapplyAllMaterialPresets3D/findPresetForName3D
// devem usar pra aplicar de verdade na cena (ver syncActiveMaterialPresetsBucket3D).
// O painel de presets (🎨) pode editar um bucket diferente do ativo (ver
// presetEditQuality3D mais abaixo), pra dar pra configurar a qualidade que
// não está sendo exibida agora sem precisar reabrir o 3D nela.
let materialPresetsAll3D={ detalhado:{}, leve:{} };
let materialPresets3D=materialPresetsAll3D.detalhado;
function syncActiveMaterialPresetsBucket3D(){
  materialPresets3D = materialPresetsAll3D[render3DQuality] || (materialPresetsAll3D[render3DQuality]={});
}

// Materiais de árvore COMPARTILHADOS entre todas as árvores (criados uma vez
// em initScene3D, não por árvore/rebuild) — isso é o que permite: (1) o
// painel de texturas listar "Tronco"/"Folhagem" como 2 entradas fixas em vez
// de dezenas, e (2) o ajuste de cor/rugosidade feito pelo usuário sobreviver
// a reconstruções da cena (variação entre árvores fica só no tamanho/forma).
let trunkMaterial3D=null, foliageMaterial3D=null;

// Registro de materiais distintos presentes na cena, pro painel de texturas
// (🎨). Chave = nome do material (agrupando por nome — ver materialGroupKey3D)
// ou uuid como fallback pra materiais sem nome. Cada entrada guarda um Set
// com TODOS os objetos Material daquele grupo, já que ajustar uma textura
// deve valer pra todas as peças que usam a "mesma" textura (mesmo nome), não
// só pro objeto Material específico que calhou de ser clicado/selecionado
// primeiro. Repovoado a cada rebuildScene3D.
const materialRegistry3D=new Map(); // groupKey -> { label, materials:Set<Material> }

// Preferências de exibição 3D (sessão apenas — não é salvo no projeto, igual
// state.viewMode).
let render3DSettings={ shadows:true, shadowQuality:'ultra', aa:'baixo', hdrUrl:null, reflectionQuality:'padrao', ambientLevel:'alta' };

// Cada tier define o tipo de shadow map, a resolução do mapa, o "bias"
// (evita peter-panning) e o "radius" (suaviza a borda da sombra — só tem
// efeito com PCFShadowMap/PCFSoftShadowMap). "normalBiasFactor" é usado pra
// calcular um normalBias PROPORCIONAL ao tamanho do frustum da sombra (ver
// fitShadowCameraToScene) — sem isso, o mesmo bias fixo causava "acne"
// (auto-sombreamento/triângulos escuros falsos) em telhados em algumas
// posições/rotações e não em outras, porque o tamanho do texel da sombra
// muda conforme o tamanho da planta, mas o bias era sempre o mesmo valor.
// "maxima" existe pra quem quer a melhor qualidade possível.
const SHADOW_QUALITY_MAP={
  padrao:{ type:'BasicShadowMap',   mapSize:1024, bias:-0.0003, radius:1, normalBiasFactor:3.0 },
  alta:  { type:'PCFShadowMap',     mapSize:2048, bias:-0.0002, radius:2, normalBiasFactor:2.5 },
  ultra: { type:'PCFSoftShadowMap', mapSize:4096, bias:-0.0001, radius:4, normalBiasFactor:2.0 },
  maxima:{ type:'PCFSoftShadowMap', mapSize:8192, bias:-0.0001, radius:6, normalBiasFactor:1.5 }
};

// Nível de antisserrilhado: em vez de limitar o pixel ratio EM (devicePixelRatio),
// isso agora multiplica por cima dele — supersampling de verdade. Limitar
// abaixo do devicePixelRatio (como antes) fazia os 3 níveis darem
// exatamente no mesmo valor em qualquer monitor comum (não-Retina, DPR=1),
// que é por isso que a opção parecia não fazer nada.
const AA_SUPERSAMPLE_MAP={ baixo:1, medio:1.6, alto:2.5 };
const AA_MAX_PIXEL_RATIO=4; // teto de segurança pra não estourar em telas Retina/4K

// "Qualidade de reflexo": intensidade do envMap (reflexo/luz de ambiente
// baseada em imagem) aplicada a todos os materiais da cena. Funciona melhor
// com um HDR de verdade carregado (scene.environment) — sem HDR, o reflexo
// vem só das luzes normais, então o efeito é mais sutil.
const REFLECTION_QUALITY_MAP={ baixa:0.4, padrao:0.7, alta:1.0, maxima:1.4 };

// "Iluminação global (GI)": antes era só uma luz ambiente plana (sem
// direção, sem cor real do entorno). Agora usa o próprio ambiente da cena
// (céu procedural gerado ou HDR real do usuário) como fonte de luz difusa
// nas superfícies — cada material tem scene.environment associado
// explicitamente no envMap (ver syncMaterialsEnvMap3D), e "giMul" entra como
// multiplicador de material.envMapIntensity, junto com a "Qualidade de
// reflexo" (ver applyReflectionQuality) — essa combinação é o que
// efetivamente funciona de forma confiável no three.js atual (o caminho
// "scene.environmentIntensity" sozinho não afeta materiais com envMap
// explícito, e é exatamente isso que a "Qualidade de reflexo" precisa pra
// funcionar). Além disso, cada nível também ajusta a HemisphereLight (bounce
// céu/chão, com cor) e a luz de preenchimento (segunda luz direcional, mais
// fraca/suave que o sol).
const AMBIENT_LEVEL_MAP={
  baixa:  { giMul:0.5, hemi:0.25, fill:0.15 },
  media:  { giMul:1.0, hemi:0.45, fill:0.28 },
  alta:   { giMul:1.6, hemi:0.65, fill:0.42 },
  maxima: { giMul:2.3, hemi:0.9,  fill:0.6  }
};

// Movimento livre (WASD) dentro da aba 3D — pan da câmera (+ do alvo do
// OrbitControls) ao longo do plano horizontal, na direção pra onde a câmera
// está olhando. O mouse continua livre pra orbitar via OrbitControls.
const moveKeys3D={w:false,a:false,s:false,d:false};
let shiftHeld3D=false; // acelera o WASD enquanto pressionado
let spaceHeld3D=false; // desacelera o WASD enquanto pressionado (oposto do Shift)
function is3DTypingTarget(el){
  if(!el) return false;
  const tag=(el.tagName||'').toLowerCase();
  return tag==='input'||tag==='textarea'||tag==='select'||el.isContentEditable;
}

// ---- Arrasto de câmera com o mouse (botão esquerdo=orbitar, direito=pan, -
// meio=olhar ao redor parado no lugar) --------------------------------------
// Os três modos usam Pointer Lock (ver setupLookAroundControls3D) pra não
// depender da posição real do cursor do sistema operacional — sem isso, um
// arrasto mais longo esbarrava na borda do monitor e travava de girar/mover.
// dragMode3D guarda qual dos três está ativo no momento (ou null se nenhum).
let dragMode3D=null; // 'orbit' | 'pan' | 'look' | null
let lookYaw3D=0, lookPitch3D=0;
let lookDistance3D=10;
// Primeiro 'mousemove' depois do Pointer Lock engatar de fato costuma vir com
// um movementX/Y espúrio e grande (efeito colateral conhecido da própria API
// em vários navegadores — o SO precisa "recentralizar" o cursor de verdade
// pra travá-lo, e esse recentralizar aparece disfarçado de um movimento
// enorme no primeiro evento). Se não descartarmos esse primeiro evento, a
// câmera dá um giro/pulo sozinha bem no meio do arrasto, sem o usuário ter
// soltado o botão. Ver 'pointerlockchange' em setupLookAroundControls3D.
let ignoreNextMove3D=false;

const modelCache = new Map();   // url -> Promise<THREE.Group>
const failedUrls  = new Set();  // urls que já falharam — não tenta de novo, cai no placeholder

let gltfLoader3D=null;

function ensureLoader3D(){
  if(gltfLoader3D) return gltfLoader3D;
  gltfLoader3D=new THREE.GLTFLoader();
  try{
    const draco=new THREE.DRACOLoader();
    draco.setDecoderPath('https://unpkg.com/three@0.169.0/examples/jsm/libs/draco/');
    gltfLoader3D.setDRACOLoader(draco);
  }catch(e){ /* DRACO é opcional — sem ele, .glb não-comprimidos continuam funcionando */ }
  return gltfLoader3D;
}

// Detecta materiais "tipo vidro" — nome contendo vidro/glass/janela/window,
// ou transparência/transmissão de verdade no material (opacity baixo,
// MeshPhysicalMaterial.transmission). Usado só pra decidir se a peça deve ou
// não LANÇAR sombra (ver loadModel): sem essa distinção, toda janela virava
// uma parede opaca pro shadow map, bloqueando o sol de entrar pela janela —
// o que não faz sentido pra uma peça de vidro de verdade.
function isGlassLikeMaterial3D(m){
  if(!m) return false;
  const name=(m.name||'').toLowerCase();
  if(/vidro|glass|janela|window|vitr/.test(name)) return true;
  if(m.transparent && typeof m.opacity==='number' && m.opacity<0.85) return true;
  if('transmission' in m && m.transmission>0.05) return true;
  return false;
}

function loadModel(url){
  if(failedUrls.has(url)) return Promise.reject(new Error("previously failed: "+url));
  if(!modelCache.has(url)){
    modelCache.set(url, new Promise((resolve,reject)=>{
      ensureLoader3D().load(url, gltf=>{
        // Habilita sombra em todas as malhas do modelo real (o placeholder já
        // nasce com isso ligado) — sem isso, "Sombras de alta qualidade" não
        // teria efeito visível nenhum em modelos .glb carregados de verdade.
        // EXCETO peças de vidro (ver isGlassLikeMaterial3D): essas não
        // lançam sombra própria, pra luz do sol conseguir "atravessar" a
        // janela — sem essa exceção, toda janela bloqueava luz feito parede.
        // receiveShadow continua ligado nelas (o vidro ainda pode mostrar a
        // sombra de outra coisa projetada nele, isso é normal/realista).
        gltf.scene.traverse(obj=>{
          if(obj.isMesh){
            const mats=Array.isArray(obj.material)?obj.material:[obj.material];
            const isGlass=mats.some(isGlassLikeMaterial3D);
            obj.castShadow=!isGlass;
            obj.receiveShadow=true;
          }
        });
        resolve(gltf.scene);
      }, undefined, err=>{
        failedUrls.add(url);
        modelCache.delete(url);
        reject(err);
      });
    }));
  }
  return modelCache.get(url);
}

// ---- Placeholder (caixa colorida) enquanto não há .glb real ---------------
function placeholderMesh(ty){
  const h=2.7; // altura fixa default do placeholder (não há mais campo editável de altura)
  const w=Math.max(0.05,(ty&&ty.w)||0.5);
  const d=Math.max(0.05,(ty&&ty.d)||0.5);
  const geo=new THREE.BoxGeometry(w,h,d);
  const mat=new THREE.MeshStandardMaterial({color:(ty&&ty.color)||'#999999'});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.position.y=h/2; // base assentada em y=0
  mesh.castShadow=true; mesh.receiveShadow=true;
  return mesh;
}
// Placeholder equivalente para paredes avulsas (usa length/thickness em vez de w/d)
function placeholderWallMesh(wt){
  const h=2.7; // altura fixa default do placeholder (não há mais campo editável de altura)
  const length=Math.max(0.05,(wt&&wt.length)||0.5);
  const thickness=Math.max(0.02,(wt&&wt.thickness)||0.1);
  const geo=new THREE.BoxGeometry(thickness,h,length);
  const mat=new THREE.MeshStandardMaterial({color:(wt&&wt.color)||'#B9B2A3'});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.position.y=h/2;
  mesh.castShadow=true; mesh.receiveShadow=true;
  return mesh;
}

// Devolve a lista de peças (model3d.parts) que devem entrar na cena para uma
// instância específica (painel ou parede avulsa), já filtrando pelo estado
// dela: sempre no máximo uma peça de papel "base" (a escolhida via
// inst.variantId, ou a primeira "base" cadastrada), e para os demais papéis,
// a primeira peça daquele papel cuja condição esteja ativa na instância
// (parede lateral sólida/porta, canto, oitão). Isso substitui a antiga busca
// por nomes de objeto tipo "OPT_lateral_L_solid" dentro do arquivo: agora
// quem marca o papel de cada peça é o próprio cadastro (campo "papel"),
// não um nome técnico dentro do .glb.
function resolvePartsForInstance(ty, inst){
  const parts=(ty&&ty.model3d&&Array.isArray(ty.model3d.parts))?ty.model3d.parts:[];
  if(!parts.length) return [];
  const byRole=role=>parts.filter(p=>p.role===role&&p.url);
  const result=[];

  const bases=byRole('base');
  const chosenBase=(inst.variantId&&bases.find(p=>p.id===inst.variantId))||bases[0];
  if(chosenBase) result.push(chosenBase);

  const w=inst.walls||{};
  // 'open' é o valor que o botão "Esq/Dir" da planta baixa realmente atribui
  // pra opção "Aberturas" (WALLCYCLE cicla none -> solid -> open; 'window' é
  // um valor legado que não é mais alcançável por esse botão). Antes só
  // 'window' disparava a peça "lateral_..._porta", então o papel "Lateral —
  // porta/janela" nunca aparecia quando a planta baixa estava em "Aberturas".
  // Aceitamos os dois valores aqui pra também continuar compatível com
  // qualquer dado antigo salvo como 'window'.
  if(w.l==='solid'){ const p=byRole('lateral_l_solida')[0]; if(p) result.push(p); }
  if(w.l==='open'||w.l==='window'){ const p=byRole('lateral_l_porta')[0]; if(p) result.push(p); }
  if(w.r==='solid'){ const p=byRole('lateral_r_solida')[0]; if(p) result.push(p); }
  if(w.r==='open'||w.r==='window'){ const p=byRole('lateral_r_porta')[0]; if(p) result.push(p); }

  const c=inst.corners||{};
  if(c.tl){ const p=byRole('canto_tl')[0]; if(p) result.push(p); }
  if(c.tr){ const p=byRole('canto_tr')[0]; if(p) result.push(p); }
  if(c.bl){ const p=byRole('canto_bl')[0]; if(p) result.push(p); }
  if(c.br){ const p=byRole('canto_br')[0]; if(p) result.push(p); }

  if(inst.oitaoAtivo){ const p=byRole('oitao')[0]; if(p) result.push(p); }

  // Porta da parede (paredes avulsas com doorFlexible ativo — ver barra de
  // seleção "abre: Dentro/Fora" + "dobradiça: Esq/Dir"). São dois eixos
  // independentes, então a peça certa é uma das 4 combinações cadastradas
  // acima (porta_dentro_esquerda / porta_dentro_direita / porta_fora_esquerda
  // / porta_fora_direita). Mesma lógica de fallback usada na barra de seleção
  // (renderSelbar): usa a escolha da instância (inst.doorOpens/doorHinge) e,
  // se não houver, cai pro padrão cadastrado no tipo de parede.
  const doorsArr=(ty&&ty.doors&&ty.doors.length)?ty.doors:(ty&&ty.door?[ty.door]:[]);
  if(ty&&ty.doorFlexible&&doorsArr.length){
    const firstDoor=doorsArr[0];
    const opens=inst.doorOpens||firstDoor.opens||'fora';
    const hinge=inst.doorHinge||firstDoor.hinge||'esquerda';
    const p=byRole('porta_'+opens+'_'+hinge)[0];
    if(p) result.push(p);
  }

  return result;
}

// Devolve um clone pronto p/ inserir na cena a partir do cache já resolvido,
// ou null se ainda não estiver disponível (nesse caso quem chama usa placeholder).
function cachedInstanceOrNull(url){
  // Só é seguro chamar depois que o preload (Promise.all) já resolveu.
  const cached=modelCache.get(url);
  if(cached && cached.__resolvedObject) return cached.__resolvedObject.clone();
  return null;
}

// Monta o node 3D de uma instância (painel ou parede avulsa) juntando a peça
// "base" + todas as peças opcionais cuja condição esteja ativa, cada uma já
// carregada e posicionada corretamente dentro do próprio arquivo (mesma
// origem/escala da base). Se nenhuma peça real carregar (nada cadastrado
// ainda, ou preload falhou pra todas), cai no placeholder (caixa colorida).
// A aparência (cor/rugosidade/reflexo) não é mexida aqui — isso agora é
// feito globalmente por material no painel de Texturas (🎨) do canvas 3D,
// ver ensureMaterialHSLPatched/collectSceneMaterials3D.
function buildInstanceNode3D(ty, inst, placeholderFn){
  const partsNeeded=resolvePartsForInstance(ty, inst);
  if(!partsNeeded.length) return placeholderFn(ty);

  const group=new THREE.Group();
  partsNeeded.forEach(part=>{
    const clone=cachedInstanceOrNull(resolvedModelUrl(part.url));
    if(clone) group.add(clone);
  });

  return group.children.length ? group : placeholderFn(ty);
}

// ---- Setup da cena (uma única vez) ----------------------------------------
function initScene3D(){
  if(sceneReady3D) return;
  scene3D=new THREE.Scene();
  scene3D.background=new THREE.Color(0xEEF0F3); // usado só como cor de fallback; o céu procedural (esfera) cobre isso visualmente

  camera3D=new THREE.PerspectiveCamera(50, aspect3D(), 0.1, 800);

  // antialias:true fica sempre ligado na criação (MSAA nativo do WebGL, não
  // dá pra trocar em runtime sem recriar o contexto). O seletor "Nível de
  // antisserrilhado" do painel de opções controla uma camada extra por cima
  // disso (pixel ratio / supersampling), aplicada logo abaixo via
  // applyRender3DSettings().
  // powerPreference:'high-performance' pede ao navegador pra criar o
  // contexto WebGL na GPU dedicada (quando existe uma), em vez de deixar o
  // driver escolher a integrada por padrão (comportamento de "default").
  // Isso é só uma preferência — o navegador/driver ainda pode ignorar em
  // alguns casos (ex: notebook com Optimus mal configurado no driver da
  // NVIDIA/AMD), então se mesmo assim continuar na integrada, vale checar
  // as configurações de "GPU de alto desempenho" do sistema operacional /
  // painel de controle da placa de vídeo para o navegador específico.
  renderer3D=new THREE.WebGLRenderer({canvas:canvas3d, antialias:true, powerPreference:'high-performance'});

  // Pipeline "realista": sem tone mapping (padrão do three.js) qualquer luz/
  // reflexo de ambiente um pouco mais forte satura em branco puro — é uma das
  // razões da cena parecer "de jogo" em vez de foto. ACESFilmicToneMapping é
  // o mesmo tone mapping usado por engines de jogo/render físico (Unreal,
  // Filament) pra comprimir realces com uma curva suave em vez de cortar. O
  // outputColorSpace correto é o que faz a textura da grama e o HDR baterem
  // com a cor "certa" (sem isso, tudo fica meio lavado/mais claro que devia).
  renderer3D.toneMapping=THREE.ACESFilmicToneMapping;
  renderer3D.toneMappingExposure=1.05;
  renderer3D.outputColorSpace=THREE.SRGBColorSpace;

  // ambientLight3D fica bem fraco agora — a maior parte da "iluminação
  // global" vem do scene.environment (envMap explícito em cada material, ver
  // syncMaterialsEnvMap3D/applyReflectionQuality) + da HemisphereLight
  // abaixo, que dão direção e cor de verdade ao bounce (o ambiente sozinho
  // não é suficiente em partes da cena sem nenhum reflexo de envMap, ex.:
  // materiais não-PBR/placeholder).
  ambientLight3D=new THREE.AmbientLight(0xffffff, 0.08);
  // HemisphereLight: bounce céu (de cima) / grama (de baixo) — muito mais
  // parecido com iluminação indireta real do que uma AmbientLight plana, já
  // que a cor muda conforme a superfície olha pra cima ou pra baixo.
  hemiLight3D=new THREE.HemisphereLight(0x9fc4e8, 0x4f7a3f, 0.38);
  const sun=new THREE.DirectionalLight(0xfff3d6, 2.6);
  sun.position.set(30,40,20);
  sun.castShadow=true;
  scene3D.add(ambientLight3D, hemiLight3D, sun);
  scene3D.add(sun.target);
  sun3D=sun;

  // Luz de preenchimento: simula luz indireta/bounce (vem de um ângulo
  // diferente do sol, mais fraca) e preenche o que seria sombra 100% preta
  // só com a luz ambiente.
  fillLight3D=new THREE.DirectionalLight(0xcfe0ff, 0.18);
  // O preenchimento não deve produzir uma segunda sombra: ele representa a
  // luz difusa do céu/ambiente, enquanto somente o sol define as sombras.
  fillLight3D.castShadow=false;
  scene3D.add(fillLight3D, fillLight3D.target);

  groundMesh3D=new THREE.Mesh(
    new THREE.PlaneGeometry(400,400),
    new THREE.MeshStandardMaterial({map:buildGrassTexture3D(), roughness:0.95, metalness:0, name:'Grama (chão)'})
  );
  groundMesh3D.rotation.x=-Math.PI/2;
  groundMesh3D.receiveShadow=true;
  scene3D.add(groundMesh3D);

  // Materiais de árvore compartilhados — ver comentário na declaração das
  // variáveis, no topo do módulo.
  trunkMaterial3D=new THREE.MeshStandardMaterial({color:0x6b4a30, roughness:0.9, name:'Tronco das árvores'});
  foliageMaterial3D=new THREE.MeshStandardMaterial({color:0x3f7a3f, roughness:0.85, name:'Folhagem das árvores'});

  treesGroup3D=new THREE.Group();
  scene3D.add(treesGroup3D);
  buildDefaultSky3D();

  panelsGroup3D=new THREE.Group();
  wallsGroup3D=new THREE.Group();
  scene3D.add(panelsGroup3D, wallsGroup3D);

  // Blocos de fundação (mesma posição/dimensão usada na "planta de blocos"
  // do PDF — ver computeBlocosLayout) — vão de y=0 até y=HOUSE_BASE_Y, e é
  // em cima deles que o chalé (piso/parede/mezanino/escada) se apoia.
  blockMaterial3D=new THREE.MeshStandardMaterial({map:buildConcreteTexture3D(), color:0xffffff, roughness:0.92, metalness:0, name:'Blocos de fundação'});
  blocksGroup3D=new THREE.Group();
  scene3D.add(blocksGroup3D);

  controls3D=new THREE.OrbitControls(camera3D, renderer3D.domElement);
  controls3D.enableDamping=true;
  // Os três botões do mouse (esquerdo=orbitar, direito=pan, meio=olhar ao
  // redor) agora são tratados manualmente em setupLookAroundControls3D, com
  // Pointer Lock, pra não bater na borda do monitor num arrasto longo. O
  // OrbitControls usa 'event.clientX/clientY' internamente (que fica
  // congelado sob Pointer Lock), então seu tratamento nativo de mouse fica
  // desligado nos três botões pra não competir com o nosso.
  controls3D.mouseButtons.LEFT=null;
  controls3D.mouseButtons.MIDDLE=null;
  controls3D.mouseButtons.RIGHT=null;
  // maxPolarAngle REMOVIDO (era Math.PI/2-0.02, "não deixa orbitar por baixo
  // da grama"). Esse limite era a causa raiz do "pulo" da câmera ao soltar o
  // botão do meio (olhar ao redor) olhando pra cima: o alvo recalculado
  // nessa hora ficava do lado de fora do intervalo permitido, e o
  // OrbitControls forçava a câmera de volta pra dentro do limite no frame
  // seguinte. A proteção contra a câmera afundar na grama continua ativa do
  // mesmo jeito, só que por outro caminho: CAMERA_MIN_HEIGHT trava
  // diretamente camera3D.position.y todo frame (ver applyWASDMovement3D e
  // renderLoop3D), então não depender mais do maxPolarAngle pra isso é
  // seguro — e resolve o pulo de vez, sem precisar de nenhuma reconciliação
  // especial ao soltar o botão.
  controls3D.minPolarAngle=0;
  controls3D.maxPolarAngle=Math.PI;
  // Sensibilidade reduzida (pedido explícito — botão esquerdo/direito e o
  // scroll do mouse estavam "nervosos" demais). rotateSpeed/panSpeed são
  // lidos por setupLookAroundControls3D (arrasto customizado com Pointer
  // Lock); zoomSpeed é usado direto pelo OrbitControls no scroll (não
  // interceptamos o wheel manualmente, então baixar aqui já é suficiente).
  controls3D.rotateSpeed=0.5;
  controls3D.panSpeed=0.5;
  controls3D.zoomSpeed=0.5;

  clock3D=new THREE.Clock();

  applyRender3DSettings(); // sombras/qualidade/pixel ratio conforme render3DSettings
  applyAmbientLevel();
  applyReflectionQuality();
  // NOTA: HDR/presets de textura NÃO são aplicados aqui. Isso agora é feito
  // de um único lugar (setViewMode3D, ao entrar no 3D), só DEPOIS que
  // rebuildScene3D() confirma que a cena terminou de carregar de verdade
  // (peças + materiais já existem) — ver loadRender3dConfig/state.render3d.
  // Aplicar aqui dentro de initScene3D era cedo demais: a cena ainda nem
  // tinha painéis/paredes construídos nesse ponto.
  fitShadowCameraToScene(); // enquadra a câmera de sombra num valor inicial razoável
  resizeRenderer3D();
  window.addEventListener('resize', resizeRenderer3D);
  if(window.ResizeObserver){
    resizeObserver3D=new ResizeObserver(resizeRenderer3D);
    resizeObserver3D.observe(stage3dEl);
  }

  setupLookAroundControls3D();

  sceneReady3D=true;
}

// ---- Céu procedural (gradiente + sol) e grama --------------------------
// Tudo gerado via <canvas> em memória — sem depender de nenhum arquivo de
// textura externo, então funciona imediatamente sem link nenhum. Fica
// visível o tempo todo, exceto quando um ambiente HDR real é aplicado (ver
// applyHdrEnvironment3D), que assume o lugar do céu/luz ambiente.
function buildSkyGradientTexture3D(){
  const canvas=document.createElement('canvas');
  canvas.width=2; canvas.height=256;
  const ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,256);
  grad.addColorStop(0,   '#2f6fc4');
  grad.addColorStop(0.45,'#7fb8e6');
  grad.addColorStop(0.72,'#d9edf5');
  grad.addColorStop(1,   '#eef4e6');
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,2,256);
  const tex=new THREE.CanvasTexture(canvas);
  if(THREE.SRGBColorSpace) tex.colorSpace=THREE.SRGBColorSpace;
  return tex;
}
function buildSunTexture3D(){
  const size=256;
  const canvas=document.createElement('canvas');
  canvas.width=size; canvas.height=size;
  const ctx=canvas.getContext('2d');
  const grad=ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  grad.addColorStop(0,   'rgba(255,255,235,1)');
  grad.addColorStop(0.22,'rgba(255,250,205,0.95)');
  grad.addColorStop(0.55,'rgba(255,240,180,0.28)');
  grad.addColorStop(1,   'rgba(255,240,180,0)');
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,size,size);
  return new THREE.CanvasTexture(canvas);
}
function buildDefaultSky3D(){
  const geo=new THREE.SphereGeometry(300,32,16);
  const mat=new THREE.MeshBasicMaterial({map:buildSkyGradientTexture3D(), side:THREE.BackSide, depthWrite:false, fog:false});
  const dome=new THREE.Mesh(geo,mat);
  dome.renderOrder=-10;

  // depthTest:true é essencial aqui — sem isso (como estava antes), o sol
  // desenhava por cima de tudo sem checar se havia geometria (o chalé) na
  // frente dele do ponto de vista da câmera, e por isso "flutuava" na frente
  // do telhado sempre que o chalé ficava entre a câmera e a direção do sol.
  // depthWrite:false continua desligado só pra não bloquear outras coisas
  // transparentes desenhadas depois.
  const sunMat=new THREE.SpriteMaterial({map:buildSunTexture3D(), transparent:true, depthWrite:false, depthTest:true});
  const sunSprite=new THREE.Sprite(sunMat);
  sunSprite.scale.set(70,70,1);
  sunSprite.renderOrder=-9;

  const group=new THREE.Group();
  group.add(dome, sunSprite);
  skyGroup3D=group;
  sunSprite3D=sunSprite;
  scene3D.add(group);
  positionSunSprite3D();
}
function positionSunSprite3D(){
  if(!sunSprite3D||!sun3D) return;
  const dir=sun3D.position.clone().normalize();
  sunSprite3D.position.copy(dir.multiplyScalar(280));
}

// Textura de grama gerada em canvas (base verde + "fiapos" de grama em tons
// variados), repetida (tiling) sobre o plano do chão.
function buildGrassTexture3D(){
  const size=256;
  const canvas=document.createElement('canvas');
  canvas.width=size; canvas.height=size;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#5c8c3f';
  ctx.fillRect(0,0,size,size);
  for(let i=0;i<1500;i++){
    const x=Math.random()*size, y=Math.random()*size;
    const hue=86+Math.random()*22, light=18+Math.random()*20;
    ctx.strokeStyle=`hsl(${hue},40%,${light}%)`;
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+(Math.random()*4-2), y-(3+Math.random()*5));
    ctx.stroke();
  }
  const tex=new THREE.CanvasTexture(canvas);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(50,50);
  if(THREE.SRGBColorSpace) tex.colorSpace=THREE.SRGBColorSpace;
  return tex;
}

// Textura de concreto gerada em canvas (base cinza + grão/manchas em tons
// variados de cinza), mesmo princípio da textura de grama — usada nos
// blocos de fundação (ver blockMaterial3D/scatterBlocks3D).
function buildConcreteTexture3D(){
  const size=256;
  const canvas=document.createElement('canvas');
  canvas.width=size; canvas.height=size;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#B9B2A4';
  ctx.fillRect(0,0,size,size);
  // Grão fino (ruído pixel a pixel) — só as "bolinhas" pequenas, sem manchas grandes.
  for(let i=0;i<5000;i++){
    const x=Math.random()*size, y=Math.random()*size;
    const light=38+Math.random()*32;
    ctx.fillStyle=`hsla(35,6%,${light}%,0.5)`;
    ctx.fillRect(x,y,1,1);
  }
  // Alguns traços finos escuros (trincas/juntas sutis).
  ctx.strokeStyle='rgba(60,55,48,0.25)';
  ctx.lineWidth=0.6;
  for(let i=0;i<6;i++){
    let x=Math.random()*size, y=Math.random()*size;
    ctx.beginPath();ctx.moveTo(x,y);
    const segs=2+Math.floor(Math.random()*3);
    for(let s=0;s<segs;s++){
      x+=(Math.random()*40-20); y+=(Math.random()*40-20);
      ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  const tex=new THREE.CanvasTexture(canvas);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(3,3);
  if(THREE.SRGBColorSpace) tex.colorSpace=THREE.SRGBColorSpace;
  return tex;
}

// ---- Árvores procedurais ao redor da planta --------------------------
// PRNG determinístico (mulberry32): mesma semente => mesmas árvores, então
// elas não "pulam" de posição a cada troca de aba — só mudam quando o
// tamanho da planta muda de verdade.
function mulberry32_3D(seed){
  return function(){
    seed|=0; seed=seed+0x6D2B79F5|0;
    let t=Math.imul(seed^seed>>>15, 1|seed);
    t=t+Math.imul(t^t>>>7, 61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}
function buildTreeMesh3D(rand){
  // Altura total varia de 4.7 a 7.5m (era 3.2–6m; +1,5m pedido explícito),
  // com troncos e copas proporcionalmente mais grossos também — não é só
  // mais alto, é mais "cheio".
  const totalH=4.7+rand()*2.8;
  const trunkH=totalH*(0.28+rand()*0.05);
  const trunkR=0.16+rand()*0.10;
  const trunk=new THREE.Mesh(
    new THREE.CylinderGeometry(trunkR*0.7, trunkR, trunkH, 7),
    trunkMaterial3D
  );
  trunk.position.y=trunkH/2;
  trunk.castShadow=true; trunk.receiveShadow=true;

  const foliageH=totalH-trunkH;
  const foliageR=1.15+rand()*0.95;
  const foliage=new THREE.Mesh(
    new THREE.ConeGeometry(foliageR, foliageH, 9),
    foliageMaterial3D
  );
  foliage.position.y=trunkH+foliageH*0.45;
  foliage.castShadow=true; foliage.receiveShadow=true;

  const tree=new THREE.Group();
  tree.add(trunk, foliage);
  return tree;
}
// Raio do "anel" mais próximo onde as árvores ficam, a partir do bounding box
// da planta — a distância desse anel específico NÃO muda (pedido explícito);
// os anéis extras (mais árvores) ficam mais longe, sem afetar essa distância.
function treeRingRadius3D(bb){
  return Math.max(bb.w,bb.h)*0.85+6;
}
// Alcance mais externo entre todos os anéis de árvore — usado por
// fitShadowCameraToScene pra decidir até onde vale a pena estender a câmera
// de sombra (cobrir TODOS os anéis diluiria demais a resolução da sombra
// perto do chalé, que é o que mais importa; cobrir só os 2 mais próximos é
// um meio-termo melhor).
function treeShadowCoverageRadius3D(bb){
  return treeRingRadius3D(bb)*1.6;
}
function scatterTrees3D(bb){
  if(!treesGroup3D) return;
  clearGroup(treesGroup3D);
  const cx=bb.x+bb.w/2, cz=bb.y+bb.h/2;
  const ringR=treeRingRadius3D(bb); // distância do anel mais próximo — sem alteração, já estava boa
  const seed=Math.round(bb.w*97+bb.h*57+13);
  const rand=mulberry32_3D(seed);

  // Vários anéis concêntricos (o primeiro na mesma distância de sempre, os
  // demais mais longe) — bem mais árvores no total, dando aparência de
  // "cercado por floresta" em vez de um círculo fino de árvores.
  const rings=[
    { r:ringR,       count:22+Math.floor(rand()*8)  },
    { r:ringR*1.55,  count:28+Math.floor(rand()*10) },
    { r:ringR*2.2,   count:34+Math.floor(rand()*14) }
  ];

  rings.forEach(ring=>{
    for(let i=0;i<ring.count;i++){
      const a=(i/ring.count)*Math.PI*2 + rand()*0.5;
      const r=ring.r*(0.9+rand()*0.3);
      const tree=buildTreeMesh3D(rand);
      tree.position.set(cx+Math.cos(a)*r, 0, cz+Math.sin(a)*r);
      tree.rotation.y=rand()*Math.PI*2;
      // Variação de escala reduzida — a altura/volume já variam de verdade na
      // própria geometria (buildTreeMesh3D); uma escala extra grande estourava
      // o teto de 6m combinado com árvores já altas.
      const s=0.95+rand()*0.15;
      tree.scale.set(s,s,s);
      treesGroup3D.add(tree);
    }
  });
}

// Blocos de fundação no 3D — reaproveita EXATAMENTE a mesma posição/dimensão
// calculada para a "planta de blocos" do PDF (computeBlocosLayout, cada
// bloco 15×15cm), só acrescentando a altura: de y=0 até y=HOUSE_BASE_Y
// (0,5m). É em cima desse topo que o chalé (piso/parede/mezanino/escada)
// se apoia — ver HOUSE_BASE_Y/buildInstanceNode3D em rebuildScene3D.
function scatterBlocks3D(){
  if(!blocksGroup3D) return;
  clearGroup(blocksGroup3D);
  const {blocks}=computeBlocosLayout();
  if(!blocks.length) return;
  const geo=new THREE.BoxGeometry(BLOCO_SIZE, HOUSE_BASE_Y, BLOCO_SIZE);
  blocks.forEach(b=>{
    const mesh=new THREE.Mesh(geo, blockMaterial3D);
    mesh.position.set(b.x, HOUSE_BASE_Y/2, b.y);
    mesh.castShadow=true; mesh.receiveShadow=true;
    blocksGroup3D.add(mesh);
  });
}

// ---- Ambiente HDR opcional (substitui o céu procedural) --------------------
// Usa RGBELoader + PMREMGenerator pra transformar um .hdr equirretangular
// num environment map utilizável tanto como fundo (scene.background) quanto
// como luz/reflexo de verdade nos materiais PBR (scene.environment) — é o
// que faz "Reflexo" (metalness) nas peças realmente aparecer bonito.
let bakedEnvTexture3D=null; // ambiente gerado a partir da própria cena (padrão, sem HDR do usuário)

function ensurePMREMGenerator3D(){
  if(!pmremGenerator3D){
    pmremGenerator3D=new THREE.PMREMGenerator(renderer3D);
    pmremGenerator3D.compileEquirectangularShader();
  }
  return pmremGenerator3D;
}

// Sem isso, "Reflexo" nunca tinha nada de verdade pra refletir: scene.environment
// ficava null até o usuário colar um link de HDR manualmente, então girar o
// slider de reflexo (metalness) não tinha nenhum efeito visível — não tem
// "espelho" nenhum sem um mapa de ambiente. Isso gera um ambiente A PARTIR DO
// CENÁRIO (céu procedural + grama + árvores) via PMREMGenerator, e usa como
// scene.environment por padrão, então o reflexo já funciona sem precisar de
// nenhum HDR externo. Um HDR real colado pelo usuário continua tendo
// prioridade (essa função não roda enquanto hdrTexture3D existir).
//
// IMPORTANTE: o chalé (panelsGroup3D/wallsGroup3D) é escondido enquanto essa
// captura acontece — ele NÃO deve fazer parte do que é refletido. Sem esse
// cuidado, cada painel passava a refletir pedaços do próprio chalé (outros
// painéis, paredes, o telhado etc.), e como cada peça está numa posição e
// ângulo diferente, painéis com o EXACT MESMO material acabavam mostrando
// cor/reflexo visivelmente diferentes um do outro — não porque o material
// fosse diferente (ele não é), mas porque cada um refletia uma parte
// diferente do próprio prédio. Escondendo o chalé durante a captura, todos
// os painéis passam a refletir o mesmo pano de fundo (céu/grama/árvores),
// ficando visualmente consistentes entre si.
// A partir do three.js r163+, scene.environmentIntensity só afeta materiais
// com envMap===null (fallback implícito) — e ajustar envMapIntensity por
// material fica pouco confiável nesse mesmo caso (regressão conhecida,
// discutida no fórum oficial do three.js a partir da r166). Pra manter tanto
// "Qualidade de reflexo" quanto "Iluminação global (GI)" funcionando de
// forma previsível em qualquer versão, associamos o environment (procedural
// OU HDR real) EXPLICITAMENTE em material.envMap de cada material conhecido
// — e controlamos a intensidade combinada (reflexo × GI) direto por
// material.envMapIntensity (ver applyReflectionQuality), que é o único dos
// dois mecanismos garantido de funcionar quando envMap é explícito.
function syncMaterialsEnvMap3D(){
  if(!scene3D) return;
  const env=scene3D.environment||null;
  const apply=obj=>{
    if(!obj.material) return;
    const mats=Array.isArray(obj.material)?obj.material:[obj.material];
    mats.forEach(m=>{
      if(!m || !('envMap' in m)) return;
      if(m.envMap!==env){ m.envMap=env; m.needsUpdate=true; }
    });
  };
  if(panelsGroup3D) panelsGroup3D.traverse(apply);
  if(wallsGroup3D) wallsGroup3D.traverse(apply);
  if(treesGroup3D) treesGroup3D.traverse(apply);
  if(blocksGroup3D) blocksGroup3D.traverse(apply);
  if(groundMesh3D) apply(groundMesh3D);
}

function bakeProceduralEnvironment3D(){
  if(!scene3D||!renderer3D||hdrTexture3D) return;
  const prevPanelsVisible=panelsGroup3D?panelsGroup3D.visible:null;
  const prevWallsVisible=wallsGroup3D?wallsGroup3D.visible:null;
  try{
    if(panelsGroup3D) panelsGroup3D.visible=false;
    if(wallsGroup3D) wallsGroup3D.visible=false;
    const gen=ensurePMREMGenerator3D();
    const rendered=gen.fromScene(scene3D, 0.03, 0.1, 400);
    if(bakedEnvTexture3D) bakedEnvTexture3D.dispose();
    bakedEnvTexture3D=rendered.texture;
    scene3D.environment=bakedEnvTexture3D;
    syncMaterialsEnvMap3D();
  }catch(e){
    console.warn('[3D] Falha ao gerar ambiente de reflexo procedural:', e);
  }finally{
    // Restaura a visibilidade original do chalé, sempre — inclusive se a
    // captura falhar (catch acima) — pra nunca deixar o chalé sumido da
    // cena por causa dessa função.
    if(panelsGroup3D && prevPanelsVisible!=null) panelsGroup3D.visible=prevPanelsVisible;
    if(wallsGroup3D && prevWallsVisible!=null) wallsGroup3D.visible=prevWallsVisible;
  }
}

function applyHdrEnvironment3D(url){
  if(!scene3D||!renderer3D) return Promise.reject(new Error('Cena 3D ainda não iniciada.'));
  ensurePMREMGenerator3D();
  const loader=new THREE.RGBELoader();
  return new Promise((resolve,reject)=>{
    loader.load(url, tex=>{
      try{
        const envMap=pmremGenerator3D.fromEquirectangular(tex).texture;
        tex.dispose();
        if(hdrTexture3D) hdrTexture3D.dispose();
        if(bakedEnvTexture3D){ bakedEnvTexture3D.dispose(); bakedEnvTexture3D=null; }
        hdrTexture3D=envMap;
        scene3D.background=envMap;
        scene3D.environment=envMap;
        syncMaterialsEnvMap3D();
        if(skyGroup3D) skyGroup3D.visible=false;
        resolve();
      }catch(e){ reject(e); }
    }, undefined, err=>reject(err));
  });
}
function clearHdrEnvironment3D(){
  if(hdrTexture3D){ hdrTexture3D.dispose(); hdrTexture3D=null; }
  if(scene3D){
    scene3D.background=new THREE.Color(0xEEF0F3);
    scene3D.environment=null;
  }
  if(skyGroup3D) skyGroup3D.visible=true;
  bakeProceduralEnvironment3D(); // volta a refletir o céu/cena procedural
}

// Busca um preset salvo pelo nome de uma textura, tolerando diferenças de
// maiúsculas/minúsculas e espaços nas pontas — nome exato primeiro (caminho
// mais comum, mais rápido), com fallback insensível a caixa pra não perder
// silenciosamente um preset só por causa de "Madeira Escura" vs "madeira escura".
function findPresetForName3D(rawName){
  const name=(rawName||'').trim();
  if(!name) return null;
  if(materialPresets3D[name]) return materialPresets3D[name];
  const lower=name.toLowerCase();
  const foundKey=Object.keys(materialPresets3D).find(k=>k.trim().toLowerCase()===lower);
  return foundKey?materialPresets3D[foundKey]:null;
}

// Reaplica, em TODO material já presente na cena atual, o preset salvo com o
// mesmo nome (se existir) — usado ao importar um JSON por cima de uma cena
// que já estava aberta (nesse caso os materiais já existem/já foram
// patcheados com valores antigos, então collectSceneMaterials3D sozinho não
// bastaria: ele só aplica preset em material NUNCA visto antes). Devolve
// quantos materiais realmente bateram com algum preset, pra dar feedback
// visível (ver loadRender3dConfig) em vez de falhar em silêncio.
function reapplyAllMaterialPresets3D(){
  if(!Object.keys(materialPresets3D).length) return 0;
  let matched=0;
  const seen=new Set();
  const visit=obj=>{
    if(!obj.material) return;
    const mats=Array.isArray(obj.material)?obj.material:[obj.material];
    mats.forEach(m=>{
      if(!m||seen.has(m.uuid)) return;
      seen.add(m.uuid);
      const preset=findPresetForName3D(m.name);
      if(preset){
        ensureMaterialHSLPatched(m);
        applyMaterialPreset3D(m, preset);
        matched++;
      }
    });
  };
  if(panelsGroup3D) panelsGroup3D.traverse(visit);
  if(wallsGroup3D) wallsGroup3D.traverse(visit);
  if(treesGroup3D) treesGroup3D.traverse(visit);
  if(blocksGroup3D) blocksGroup3D.traverse(visit);
  if(groundMesh3D) visit(groundMesh3D);
  return matched;
}

// Popula materialPresetsAll3D a partir de um render3d (do JSON do projeto),
// aplicando a regra do "copiar Detalhado pro Leve por padrão" quando o
// arquivo nunca teve matPresetsLeve salvo — ver comentário completo em
// loadRender3dConfig, que reaproveita esta função. Chamada tanto ali quanto
// uma vez, eagerly, logo na inicialização da página (com state.render3d),
// pra garantir que os dois buckets já existam separados mesmo se o usuário
// salvar o projeto sem nunca ter aberto a aba 3D.
function populateMaterialPresetsAll3D(render3d){
  render3d=render3d||{};
  const detalhadoPresets=(render3d.matPresets && typeof render3d.matPresets==='object')?{...render3d.matPresets}:{};
  const levePresets=(render3d.matPresetsLeve && typeof render3d.matPresetsLeve==='object')
    ? {...render3d.matPresetsLeve}
    : JSON.parse(JSON.stringify(detalhadoPresets)); // cópia independente (deep clone)
  materialPresetsAll3D={ detalhado:detalhadoPresets, leve:levePresets };
  syncActiveMaterialPresetsBucket3D();
}

// Restaura a config de exibição 3D salva no JSON (HDR + presets de textura
// por nome — ver render3dForSave). Chamada pelo load() da planta, DEPOIS de
// qualquer rebuild necessário (ver load()) — importante, porque reaplicar
// presets só funciona em materiais que já existem na cena.
// - hdrUrl: se a cena 3D já existe (sceneReady3D), aplica na hora; senão só
//   guarda em render3DSettings.hdrUrl e initScene3D cuida de aplicar quando o
//   usuário abrir a aba 3D pela primeira vez.
// - matPresets/matPresetsLeve: substitui inteiramente materialPresetsAll3D
//   (mesmo critério do resto do load(): o JSON importado é a nova verdade do
//   projeto) e reaplica retroativamente, na cena já aberta, os presets do
//   bucket da qualidade ATIVA agora (render3DQuality) — os da outra
//   qualidade só entram em vigor quando o 3D for reaberto nela.
// - Se o arquivo NUNCA teve matPresetsLeve salvo (projeto de antes dessa
//   distinção existir, ou simplesmente ainda não configurado), o bucket
//   "leve" começa como uma CÓPIA dos presets do "detalhado" (pedido
//   explícito), em vez de vazio — cada textura já sai com o mesmo ajuste
//   dos dois lados, editável independentemente dali em diante. Se o arquivo
//   JÁ tem matPresetsLeve salvo (mesmo que vazio, de um "Copiar do
//   Detalhado"/edição anterior), isso é respeitado como intencional e não é
//   sobrescrito.
function loadRender3dConfig(render3d){
  render3d=render3d||{};
  populateMaterialPresetsAll3D(render3d);
  presetEditQuality3D=render3DQuality;
  if(typeof updatePresetQualityButtonsUI3D==='function') updatePresetQualityButtonsUI3D();
  if(typeof renderPresetList3D==='function') renderPresetList3D();

  const newHdrUrl=render3d.hdrUrl||null;
  render3DSettings.hdrUrl=newHdrUrl;
  if(typeof v3dHdrUrl!=='undefined' && v3dHdrUrl) v3dHdrUrl.value=newHdrUrl||'';
  if(typeof syncStateRender3D==='function') syncStateRender3D();

  if(sceneReady3D){
    const matched=reapplyAllMaterialPresets3D();
    if(typeof refreshMaterialsPanelUI==='function') refreshMaterialsPanelUI();
    if(Object.keys(materialPresets3D).length){
      toast(matched>0
        ? `Padrões de textura do arquivo aplicados (${matched} material(is) na cena atual).`
        : 'O arquivo tem padrões de textura salvos, mas nenhuma textura com esses nomes apareceu nesta cena ainda.');
    }
    if(newHdrUrl){
      if(typeof v3dHdrStatus!=='undefined' && v3dHdrStatus) v3dHdrStatus.textContent='Carregando ambiente HDR salvo no arquivo...';
      applyHdrEnvironment3D(newHdrUrl).then(()=>{
        if(typeof v3dHdrStatus!=='undefined' && v3dHdrStatus) v3dHdrStatus.textContent='HDR aplicado (salvo no arquivo) — o sol/reflexo vêm da imagem carregada.';
        toast('Ambiente HDR do arquivo aplicado.');
      }).catch(err=>{
        toastError('Não consegui carregar o HDR salvo no arquivo: '+((err&&err.message)||'link inválido ou CORS bloqueado.'));
      });
    } else if(hdrTexture3D){
      // Só limpa/rebaka o ambiente procedural se realmente havia um HDR
      // ativo antes — sem essa checagem, isso rodava (à toa) TODA vez que a
      // aba 3D abria, mesmo em projetos sem HDR nenhum, já que
      // rebuildScene3D() já deixa o ambiente procedural corretamente
      // "baked" sozinho.
      clearHdrEnvironment3D();
      if(typeof v3dHdrStatus!=='undefined' && v3dHdrStatus) v3dHdrStatus.textContent='Sem HDR: usando céu padrão com sol, grama e árvores geradas automaticamente.';
    }
  }
}

function aspect3D(){
  const r=stage3dEl.getBoundingClientRect();
  return Math.max(0.01, r.width/Math.max(1,r.height));
}
function resizeRenderer3D(){
  if(!renderer3D) return;
  const r=stage3dEl.getBoundingClientRect();
  if(!r.width||!r.height) return;
  camera3D.aspect=r.width/r.height;
  camera3D.updateProjectionMatrix();
  renderer3D.setSize(r.width, r.height, false);
}

// Ajusta o frustum (ortográfico) da câmera de sombra da luz direcional pro
// tamanho real da planta atual — incluindo o anel de árvores ao redor dela,
// senão as árvores ficavam fora do alcance da sombra e não projetavam/
// recebiam sombra direito. O three.js usa um frustum padrão pequeno
// (±5 unidades) que não cobre a planta inteira em quase nenhum projeto real
// — sem isso, a sombra simplesmente não aparecia direito em boa parte da
// cena, não importa a "qualidade" escolhida. Chamado a cada rebuild (a
// planta pode ter mudado de tamanho) e uma vez na criação da cena.
function fitShadowCameraToScene(bb){
  if(!sun3D) return;
  bb = bb || contentBBox();
  const cx=bb.x+bb.w/2, cz=bb.y+bb.h/2;
  const spanMax=Math.max(bb.w,bb.h,4);
  const halfSize=treeShadowCoverageRadius3D(bb)+4;

  sun3D.position.set(cx+spanMax*0.6, spanMax*0.9+8, cz+spanMax*0.7);
  sun3D.target.position.set(cx,0,cz);
  sun3D.target.updateMatrixWorld();

  const cam=sun3D.shadow.camera;
  cam.left=-halfSize; cam.right=halfSize;
  cam.top=halfSize; cam.bottom=-halfSize;
  cam.near=0.5; cam.far=spanMax*3+halfSize*2+60;
  cam.updateProjectionMatrix();

  // Luz de preenchimento (indireta): vem de um ângulo bem diferente do sol
  // (lado oposto), pra preencher o lado que o sol não alcança, com sombra
  // bem mais suave (ver refreshShadowBias3D/applyRender3DSettings).
  if(fillLight3D){
    fillLight3D.position.set(cx-spanMax*0.55, spanMax*0.65+6, cz-spanMax*0.5);
    fillLight3D.target.position.set(cx,0,cz);
    fillLight3D.target.updateMatrixWorld();
  }

  refreshShadowBias3D();
  positionSunSprite3D();
}

// Recalcula bias/normalBias da sombra com base no tamanho ATUAL do frustum
// (halfSize muda a cada planta) e na resolução ATUAL do shadow map (muda
// por tier de qualidade). normalBias precisa ser proporcional ao "tamanho
// do texel" (frustum / resolução) — um valor fixo funcionava bem só por
// coincidência em algumas combinações de tamanho/posição da planta e falhava
// (aparecendo "acne"/triângulos escuros falsos, sobretudo em telhados) em
// outras, que era exatamente o bug relatado.
function refreshShadowBias3D(){
  if(!sun3D) return;
  const q=SHADOW_QUALITY_MAP[render3DSettings.shadowQuality]||SHADOW_QUALITY_MAP.alta;
  const cam=sun3D.shadow.camera;
  const frustumSize=Math.max((cam.right-cam.left)||10, 1);
  const mapSize=sun3D.shadow.mapSize.width||1024;
  sun3D.shadow.bias=q.bias;
  sun3D.shadow.normalBias=(frustumSize/mapSize)*q.normalBiasFactor;

  // A luz de preenchimento sempre usa uma resolução menor (é secundária e
  // deliberadamente mais borrada — não precisa da mesma nitidez do sol) e um
  // radius bem maior, pra ficar visualmente "mais fraca e suave" de propósito.
}

// Aplica render3DSettings (sombras on/off, qualidade das sombras, nível de
// antisserrilhado) no renderer/luz já criados. Chamada na criação da cena e
// toda vez que algum controle do painel de opções muda.
function applyRender3DSettings(){
  if(!renderer3D||!sun3D) return;

  renderer3D.shadowMap.enabled=render3DSettings.shadows;
  // Sombras só precisam ser atualizadas quando a geometria ou as configurações
  // mudam; mover a câmera não altera o mapa do sol.
  renderer3D.shadowMap.autoUpdate=false;
  const q=SHADOW_QUALITY_MAP[render3DSettings.shadowQuality]||SHADOW_QUALITY_MAP.alta;
  const maxTex=(renderer3D.capabilities&&renderer3D.capabilities.maxTextureSize)||q.mapSize;
  const safeMapSize=Math.min(q.mapSize, maxTex);
  const newType=THREE[q.type];
  const typeChanged=renderer3D.shadowMap.type!==newType;
  renderer3D.shadowMap.type=newType;

  if(sun3D.shadow.mapSize.width!==safeMapSize){
    sun3D.shadow.mapSize.set(safeMapSize,safeMapSize);
    if(sun3D.shadow.map){ sun3D.shadow.map.dispose(); sun3D.shadow.map=null; } // força recriar no tamanho novo
  }
  sun3D.shadow.radius=q.radius;
  refreshShadowBias3D(); // bias/normalBias proporcionais ao frustum atual + resolução nova
  renderer3D.shadowMap.needsUpdate=true;

  // Trocar só o TIPO do shadow map em runtime não bastava (esse era o bug
  // real relatado: "as opções não mudam nada"): o three.js compila o shader
  // de sombreamento com o tipo de shadow map gravado no programa já
  // compilado daquele material. Sem forçar needsUpdate em todos os
  // materiais da cena, o programa antigo continuava em uso mesmo depois de
  // trocar renderer.shadowMap.type.
  if(typeChanged && scene3D){
    scene3D.traverse(obj=>{
      if(obj.material){
        const mats=Array.isArray(obj.material)?obj.material:[obj.material];
        mats.forEach(m=>{ m.needsUpdate=true; });
      }
    });
  }

  // Nível de antisserrilhado: multiplica por cima do devicePixelRatio real
  // (supersampling), em vez de limitar abaixo dele. Limitar abaixo era o
  // outro bug relatado: em qualquer monitor comum não-Retina (DPR=1), os 3
  // níveis batiam exatamente no mesmo valor (min(1, x) = 1 sempre), então a
  // opção parecia não fazer nada. Multiplicar por cima sempre gera valores
  // diferentes entre os níveis, não importa o monitor.
  const superSample=AA_SUPERSAMPLE_MAP[render3DSettings.aa]||1.6;
  const finalRatio=Math.min((window.devicePixelRatio||1)*superSample, AA_MAX_PIXEL_RATIO);
  renderer3D.setPixelRatio(finalRatio);
  resizeRenderer3D();
}

// "Iluminação global (GI)" — em vez de só uma luz ambiente plana, agora usa
// o próprio ambiente da cena (céu procedural OU HDR real do usuário, o que
// estiver ativo em scene.environment) como fonte de luz difusa de verdade em
// todos os materiais PBR — via envMap explícito + envMapIntensity (ver
// applyReflectionQuality logo abaixo), que é Image-Based Lighting (IBL), a
// aproximação padrão de GI em motores real-time tipo este. Some com a
// HemisphereLight (bounce céu/chão, com cor) e a luz de preenchimento
// (bounce direcional suave) pra cobrir também objetos/ângulos onde o envMap
// sozinho renderia escuro demais.
function applyAmbientLevel(){
  const lvl=AMBIENT_LEVEL_MAP[render3DSettings.ambientLevel]||AMBIENT_LEVEL_MAP.media;
  if(hemiLight3D) hemiLight3D.intensity=lvl.hemi;
  if(fillLight3D) fillLight3D.intensity=lvl.fill;
  applyReflectionQuality(); // a intensidade final do envMap depende de reflexo × GI juntos
}

// "Qualidade de reflexo" × "Iluminação global (GI)" — as duas juntas formam
// a intensidade final de material.envMapIntensity (ver comentário em
// AMBIENT_LEVEL_MAP pra entender por que os dois ajustes se combinam aqui em
// vez de GI usar scene.environmentIntensity separadamente). Funciona bem
// melhor com um ambiente HDR real carregado; sem HDR, usa o céu procedural
// "baked" (ver bakeProceduralEnvironment3D), que já é aplicado por padrão.
function applyReflectionQuality(){
  const base=REFLECTION_QUALITY_MAP[render3DSettings.reflectionQuality]||REFLECTION_QUALITY_MAP.alta;
  const gi=AMBIENT_LEVEL_MAP[render3DSettings.ambientLevel]||AMBIENT_LEVEL_MAP.media;
  const intensity=base*gi.giMul;
  materialRegistry3D.forEach(entry=>{
    entry.materials.forEach(m=>{ if('envMapIntensity' in m) m.envMapIntensity=intensity; });
  });
}

// Enquadra a câmera/target no bounding box atual da planta (2D -> plano X/Z).
function frameCamera3D(){
  const bb=contentBBox(); // {x,y,w,h} no mesmo sistema de coordenadas do 2D
  const cx=bb.x+bb.w/2, cz=bb.y+bb.h/2;
  const spanMax=Math.max(bb.w,bb.h,1);
  const dist=spanMax*1.4+3;
  camera3D.position.set(cx+dist*0.6, dist*0.7, cz+dist*0.9);
  controls3D.target.set(cx,0,cz);
  controls3D.update();
}

// ---- Limpeza (dispose de geometria/material antes de reconstruir) --------
function clearGroup(group, dispose=true){
  if(!group) return;
  for(let i=group.children.length-1;i>=0;i--){
    const child=group.children[i];
    group.remove(child);
    // Os modelos GLB inseridos nos grupos de paineis/paredes compartilham
    // geometria e materiais com o modelCache. Em uma reconstrucao comum,
    // remover o clone nao pode descartar esses recursos compartilhados;
    // o descarte completo acontece somente em disposeScene3D().
    if(dispose){
      child.traverse(obj=>{
        if(obj.geometry) obj.geometry.dispose();
        if(obj.material){
          const mats=Array.isArray(obj.material)?obj.material:[obj.material];
          mats.forEach(m=>{
            Object.keys(m).forEach(k=>{ if(m[k]&&m[k].isTexture) m[k].dispose(); });
            m.dispose();
          });
        }
      });
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// PAINEL DE TEXTURAS (🎨) — cor (matiz/saturação/luminosidade), rugosidade e
// reflexo ajustáveis DIRETO NO CANVAS 3D, por material, não no cadastro do
// tipo. Como o material é compartilhado entre todas as instâncias que usam
// a mesma peça/textura (clone() não clona material — ver cachedInstanceOrNull),
// ajustar aqui já afeta todo mundo que usa aquela textura de uma vez.
// ════════════════════════════════════════════════════════════════════════

// Trecho GLSL injetado no fragment shader de cada material, logo depois da
// textura base ser amostrada (#include <map_fragment>). Converte a cor pra
// HSL, aplica os 3 ajustes (matiz/saturação/luminosidade) e converte de
// volta — preserva o desenho/padrão original da textura, só muda a cor dela
// (diferente de simplesmente multiplicar por uma cor sólida, que lavaria o
// desenho da textura).
const HSL_GLSL_HELPERS=`
uniform float uHueShift;
uniform float uSatFactor;
uniform float uLightShift;
vec3 rgb2hsl_321(vec3 c){
  float mx=max(max(c.r,c.g),c.b);
  float mn=min(min(c.r,c.g),c.b);
  float l=(mx+mn)*0.5;
  float h=0.0, s=0.0;
  float d=mx-mn;
  if(d>0.00001){
    s = l<0.5 ? d/(mx+mn) : d/(2.0-mx-mn);
    if(mx==c.r) h=(c.g-c.b)/d + (c.g<c.b?6.0:0.0);
    else if(mx==c.g) h=(c.b-c.r)/d+2.0;
    else h=(c.r-c.g)/d+4.0;
    h/=6.0;
  }
  return vec3(h,s,l);
}
float hue2rgb_321(float p,float q,float t){
  if(t<0.0) t+=1.0;
  if(t>1.0) t-=1.0;
  if(t<1.0/6.0) return p+(q-p)*6.0*t;
  if(t<1.0/2.0) return q;
  if(t<2.0/3.0) return p+(q-p)*(2.0/3.0-t)*6.0;
  return p;
}
vec3 hsl2rgb_321(vec3 hsl){
  float h=hsl.x, s=hsl.y, l=hsl.z;
  if(s<0.00001) return vec3(l);
  float q = l<0.5 ? l*(1.0+s) : l+s-l*s;
  float p = 2.0*l-q;
  return vec3(hue2rgb_321(p,q,h+1.0/3.0), hue2rgb_321(p,q,h), hue2rgb_321(p,q,h-1.0/3.0));
}
`;

// Marca um material pra receber os uniforms de HSL (idempotente — não
// aplica duas vezes no mesmo material). Os valores atuais ficam guardados
// em material.userData.hslParams, que sobrevive a dispose()/recompilação
// (dispose só invalida o programa GPU cacheado, não apaga propriedades do
// objeto JS) — é isso que garante que um ajuste feito pelo usuário não se
// perde quando a cena é reconstruída (toda troca de aba 2D/3D, toda edição).
function ensureMaterialHSLPatched(material){
  if(!material.userData) material.userData={};
  if(!material.userData.hslParams){
    material.userData.hslParams={ hue:0, sat:1, light:0 };
  }
  if(!('__origRoughness' in material.userData)) material.userData.__origRoughness=('roughness' in material)?material.roughness:null;
  if(!('__origMetalness' in material.userData)) material.userData.__origMetalness=('metalness' in material)?material.metalness:null;
  if(material.userData.__hslPatched) return;
  material.userData.__hslPatched=true;

  const prevOnBeforeCompile=material.onBeforeCompile;
  material.onBeforeCompile=(shader, renderer)=>{
    if(typeof prevOnBeforeCompile==='function') prevOnBeforeCompile(shader, renderer);
    const p=material.userData.hslParams;
    shader.uniforms.uHueShift={value:p.hue};
    shader.uniforms.uSatFactor={value:p.sat};
    shader.uniforms.uLightShift={value:p.light};
    shader.fragmentShader = HSL_GLSL_HELPERS + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      {
        // O three.js trabalha em espaço linear aqui (diffuseColor já veio
        // convertido de sRGB pro sampler da textura). Fazer o ajuste de
        // matiz/saturação/luminosidade direto em espaço linear deixa o
        // resultado "errado" ao olho (mudanças de luminosidade parecem
        // fracas demais ou fortes demais dependendo do tom de base) — por
        // isso convertemos pra gama (aproximação 2.2, como Photoshop/editores
        // de imagem) antes do ajuste, e voltamos pra linear depois.
        vec3 gammaColor=pow(max(diffuseColor.rgb, vec3(0.0)), vec3(1.0/2.2));
        vec3 hsl321=rgb2hsl_321(gammaColor);
        hsl321.x=fract(hsl321.x+uHueShift);
        hsl321.y=clamp(hsl321.y*uSatFactor, 0.0, 1.0);
        hsl321.z=clamp(hsl321.z+uLightShift, 0.0, 1.0);
        vec3 adjustedGamma=hsl2rgb_321(hsl321);
        diffuseColor.rgb=pow(max(adjustedGamma, vec3(0.0)), vec3(2.2));
      }`
    );
    material.userData.__hslUniforms=shader.uniforms;
  };
  material.needsUpdate=true; // força compilar agora com o patch
}

// Aplica novos valores de matiz/saturação/luminosidade num material já
// "patcheado" — grava em userData (persistente) e, se o shader já está
// compilado agora, também atualiza o uniform ao vivo (sem esperar recompilar).
function setMaterialHSL(material, {hue, sat, light}){
  if(!material||!material.userData||!material.userData.hslParams) return;
  const p=material.userData.hslParams;
  if(hue!=null) p.hue=hue;
  if(sat!=null) p.sat=sat;
  if(light!=null) p.light=light;
  const u=material.userData.__hslUniforms;
  if(u){
    if(u.uHueShift) u.uHueShift.value=p.hue;
    if(u.uSatFactor) u.uSatFactor.value=p.sat;
    if(u.uLightShift) u.uLightShift.value=p.light;
  }
}

// Restaura cor (HSL neutro) e rugosidade/reflexo originais do material.
function resetMaterialAppearance(material){
  if(!material||!material.userData) return;
  setMaterialHSL(material, {hue:0, sat:1, light:0});
  if(material.userData.__origRoughness!=null) material.roughness=material.userData.__origRoughness;
  if(material.userData.__origMetalness!=null) material.metalness=material.userData.__origMetalness;
}

// Nome amigável pra mostrar no seletor do painel de texturas.
function friendlyMaterialLabel3D(material, fallbackIndex){
  return (material.name && material.name.trim()) ? material.name.trim() : ('Material '+(fallbackIndex+1));
}

// Chave de agrupamento: materiais com o MESMO nome (ex: dois arquivos .glb
// diferentes que usam "Madeira escura") caem na mesma entrada — ajustar um
// já ajusta todos. Materiais sem nome (nome vazio) NÃO são agrupados entre
// si (cada um vira sua própria entrada "Material N"), pra não misturar
// texturas sem nenhuma relação só porque nenhuma delas foi nomeada.
function materialGroupKey3D(material){
  const name=(material.name||'').trim();
  return name ? ('name:'+name) : ('uuid:'+material.uuid);
}

// Aplica uma função a TODO material da cena que pertença ao mesmo grupo
// (mesma chave — ver materialGroupKey3D), buscando ao vivo na cena atual em
// vez de confiar só no Set já coletado em materialRegistry3D. Isso garante
// que um ajuste feito num slider realmente alcance toda peça que usa aquela
// textura, mesmo que o registro ainda não tivesse sido atualizado por
// qualquer motivo — é usado por todos os sliders do painel de texturas.
function forEachMaterialInGroup3D(groupKey, fn){
  if(!groupKey) return;
  const seen=new Set();
  const visit=obj=>{
    if(!obj.material) return;
    const mats=Array.isArray(obj.material)?obj.material:[obj.material];
    mats.forEach(m=>{
      if(!m||seen.has(m.uuid)) return;
      if(materialGroupKey3D(m)===groupKey){ seen.add(m.uuid); fn(m); }
    });
  };
  if(panelsGroup3D) panelsGroup3D.traverse(visit);
  if(wallsGroup3D) wallsGroup3D.traverse(visit);
  if(treesGroup3D) treesGroup3D.traverse(visit);
  if(blocksGroup3D) blocksGroup3D.traverse(visit);
  if(groundMesh3D) visit(groundMesh3D);
}

// Varre a cena (painéis, paredes, chão, árvores) e monta/atualiza
// materialRegistry3D agrupando por nome (ver materialGroupKey3D), aplicando
// o patch de HSL em qualquer material novo e sincronizando os valores atuais
// do grupo pra qualquer material que só agora entrou nele. Chamado ao final
// de cada rebuildScene3D.
function collectSceneMaterials3D(){
  materialRegistry3D.clear();
  let idx=0;
  const visit=obj=>{
    if(!obj.material) return;
    const mats=Array.isArray(obj.material)?obj.material:[obj.material];
    mats.forEach(m=>{
      if(!m) return;
      const key=materialGroupKey3D(m);
      const isBrandNewGroup=!materialRegistry3D.has(key);
      ensureMaterialHSLPatched(m);
      let entry=materialRegistry3D.get(key);
      if(!entry){
        entry={ label:friendlyMaterialLabel3D(m, idx), materials:new Set() };
        materialRegistry3D.set(key, entry);
        idx++;
      }
      if(isBrandNewGroup){
        // Textura com esse nome nunca vista nesta sessão: se existir um
        // padrão salvo (ver materialPresets3D/painel "Padrão automático por
        // nome"), aplica automaticamente agora, em vez de deixar no neutro.
        const preset=findPresetForName3D(m.name);
        if(preset && typeof applyMaterialPreset3D==='function') applyMaterialPreset3D(m, preset);
      }
      if(!entry.materials.has(m)){
        // Material recém-visto nesse grupo: se o grupo já tinha algum ajuste
        // aplicado por outro membro, sincroniza esse aqui pro mesmo valor,
        // pra não ficar um "desatualizado" em relação aos outros da mesma
        // textura.
        const existing=entry.materials.values().next().value;
        if(existing){
          const p=existing.userData.hslParams;
          setMaterialHSL(m, {hue:p.hue, sat:p.sat, light:p.light});
          if('roughness' in m && 'roughness' in existing) m.roughness=existing.roughness;
          if('metalness' in m && 'metalness' in existing) m.metalness=existing.metalness;
        }
        entry.materials.add(m);
      }
    });
  };
  if(panelsGroup3D) panelsGroup3D.traverse(visit);
  if(wallsGroup3D) wallsGroup3D.traverse(visit);
  if(treesGroup3D) treesGroup3D.traverse(visit);
  if(blocksGroup3D) blocksGroup3D.traverse(visit);
  if(groundMesh3D) visit(groundMesh3D);
  syncMaterialsEnvMap3D();
  applyReflectionQuality();
  if(typeof refreshMaterialsPanelUI==='function') refreshMaterialsPanelUI();
}

// ---- Reconstrução completa da cena a partir do state ----------------------
function collectDistinctModelUrls(){
  const urls=new Set();
  const addFrom=(ty, inst)=>{
    resolvePartsForInstance(ty, inst).forEach(part=>{
      const url=resolvedModelUrl(part.url);
      if(url) urls.add(url);
    });
  };
  state.panels.forEach(p=>{ const ty=typeOf(p.typeId); if(ty) addFrom(ty, p); });
  state.wallInstances.forEach(wi=>{ const wt=wallTypeOf(wi.wallTypeId); if(wt) addFrom(wt, wi); });
  return Array.from(urls);
}

function rebuildScene3D(st){
  if(!sceneReady3D) initScene3D();
  const myToken=++rebuildToken3D;
  const urls=collectDistinctModelUrls();
  const showLoading = urls.length>0;
  if(showLoading) loading3dEl.classList.add('show');

  const preload=Promise.allSettled(urls.map(url=>
    loadModel(url).then(obj=>{
      // marca o objeto resolvido no próprio slot do cache p/ cachedInstanceOrNull()
      modelCache.set(url, Object.assign(Promise.resolve(obj), {__resolvedObject:obj}));
    })
  ));

  // Retorna a promise pra quem precisa saber quando a cena terminou de
  // reconstruir de verdade (ex: loadRender3dConfig, que só consegue
  // reaplicar HDR/presets de textura nos materiais DEPOIS que os painéis/
  // paredes do JSON recém-importado já existem na cena).
  return preload.then(()=>{
    if(myToken!==rebuildToken3D) return; // uma troca 2D->3D->2D->3D mais nova já está em curso
    loading3dEl.classList.remove('show');

    clearGroup(panelsGroup3D, false);
    clearGroup(wallsGroup3D, false);

    st.panels.forEach(panel=>{
      const ty=typeOf(panel.typeId);
      if(!ty) return;
      const node=buildInstanceNode3D(ty, panel, placeholderMesh);

      // Conversão de coordenadas: 2D usa (cx,cy) no plano da planta;
      // 3D usa X/Z como plano horizontal e Y como altura. HOUSE_BASE_Y
      // (0,5m) levanta o modelo pra ficar exatamente em cima do topo dos
      // blocos de fundação (ver scatterBlocks3D) — antes começava em y=0,
      // "flutuando" dentro do bloco em vez de apoiado nele.
      //
      // Mezanino: a parede externa que ficava somada além da área marrom foi
      // removida (ver footD/mezWallRect) — panel.cx/cy já é exatamente o
      // centro do mezanino, sem precisar de nenhuma compensação de offset.
      const px3D=panel.cx, pz3D=panel.cy;
      node.position.set(px3D, HOUSE_BASE_Y, pz3D);
      node.rotation.y = THREE.MathUtils.degToRad(-(panel.rot||0));

      panelsGroup3D.add(node);
    });

    st.wallInstances.forEach(wi=>{
      const wt=wallTypeOf(wi.wallTypeId);
      if(!wt) return;
      const node=buildInstanceNode3D(wt, wi, placeholderWallMesh);

      // Usa os cantos mundiais já calculados pelo 2D (wallInstanceWorldCorners)
      // para achar o centro do retângulo — evita duplicar a matemática de
      // ax/ay/rot aqui dentro (mesma convenção de rotação do 2D).
      const corners=wallInstanceWorldCorners(wi);
      if(corners){
        const ccx=corners.reduce((s,c)=>s+c[0],0)/corners.length;
        const ccy=corners.reduce((s,c)=>s+c[1],0)/corners.length;
        node.position.set(ccx, HOUSE_BASE_Y, ccy);
      } else {
        node.position.set(wi.ax, HOUSE_BASE_Y, wi.ay);
      }
      node.rotation.y = THREE.MathUtils.degToRad(-(wi.rot||0));

      // Paredes avulsas não têm corners como os painéis — só base/oitão se
      // cadastrados. Porta (doorOpens/doorHinge) fica fora do escopo desta
      // primeira versão (documentar como pendente).
      wallsGroup3D.add(node);
    });

    const bb=contentBBox();
    scatterTrees3D(bb);
    scatterBlocks3D();
    fitShadowCameraToScene(bb);
    if(renderer3D) renderer3D.shadowMap.needsUpdate=true;
    collectSceneMaterials3D();
    bakeProceduralEnvironment3D();
    frameCamera3D();
  });
}

// ---- Movimento livre (WASD) -------------------------------------------
// Translada câmera + alvo do OrbitControls, na direção pra onde a câmera
// está olhando. W/S seguem a inclinação real da câmera (se estiver olhando
// pra cima, W sobe; olhando pra baixo, W desce) — diferente de A/D, que
// continuam restritos ao plano horizontal (senão "strafe" ficaria estranho,
// subindo/descendo junto). Segurar SHIFT acelera o movimento; segurar
// ESPAÇO desacelera (o oposto do SHIFT, pra ajuste fino de posição); soltar
// volta pra velocidade normal. Se os dois forem pressionados ao mesmo tempo,
// ESPAÇO tem prioridade (faz mais sentido pra quem quer ir devagar de
// propósito). O OrbitControls continua ativo pro mouse orbitar normalmente —
// isso só adiciona o "andar".
const WASD_BASE_SPEED=4;      // metros por segundo
const WASD_SHIFT_MULTIPLIER=2.6;
const WASD_SPACE_MULTIPLIER=0.35; // ESPAÇO desacelera — oposto do SHIFT
const CAMERA_MIN_HEIGHT=0.35; // "chão" da câmera — nunca deixa ela afundar na grama
function applyWASDMovement3D(dt){
  if(!camera3D||!controls3D) return;
  const {w,a,s,d}=moveKeys3D;
  if(!w&&!a&&!s&&!d) return;

  const forward=new THREE.Vector3();
  camera3D.getWorldDirection(forward); // mantém o componente Y (inclinação) — usado só pra W/S

  const flatForward=forward.clone(); flatForward.y=0;
  if(flatForward.lengthSq()<1e-6) flatForward.set(0,0,-1); else flatForward.normalize();
  const right=new THREE.Vector3().crossVectors(flatForward, camera3D.up).normalize();

  const speed=WASD_BASE_SPEED * (spaceHeld3D?WASD_SPACE_MULTIPLIER:(shiftHeld3D?WASD_SHIFT_MULTIPLIER:1));
  const delta=new THREE.Vector3();
  if(w) delta.add(forward);
  if(s) delta.addScaledVector(forward,-1);
  if(d) delta.add(right);
  if(a) delta.addScaledVector(right,-1);
  if(delta.lengthSq()===0) return;

  delta.normalize().multiplyScalar(speed*dt);
  camera3D.position.add(delta);
  controls3D.target.add(delta);

  // W/S agora podem descer a câmera (olhando pra baixo) — sem isso, dava pra
  // "andar" pra baixo do nível da grama. Trava numa altura mínima acima do
  // chão, ajustando o alvo pela mesma diferença pra não desalinhar o orbit.
  if(camera3D.position.y < CAMERA_MIN_HEIGHT){
    const diff=CAMERA_MIN_HEIGHT-camera3D.position.y;
    camera3D.position.y=CAMERA_MIN_HEIGHT;
    controls3D.target.y+=diff;
  }
}

// ---- Arrasto de câmera (esquerdo=orbitar, direito=pan, meio=olhar ao redor) 
// Chamada uma vez dentro de initScene3D(). Os três botões usam Pointer Lock
// (ver mousedown abaixo): o cursor do sistema operacional é travado no lugar
// enquanto o botão está pressionado, então 'movementX/Y' continua chegando
// normalmente mesmo que o arrasto seja bem maior que a tela — sem isso, o
// cursor real batia na borda do monitor e travava de girar/mover mais.
//
// Botão esquerdo (orbitar) e direito (pan) reimplementam manualmente a mesma
// matemática do OrbitControls (rotateLeft/rotateUp/pan, ver comentários
// abaixo) em vez de deixar o próprio OrbitControls tratar o mousedown/move:
// o OrbitControls lê 'event.clientX/clientY' pra calcular o quanto o mouse
// moveu — e sob Pointer Lock o clientX/clientY do navegador FICA CONGELADO
// (só movementX/Y funciona), então o orbit/pan nativo simplesmente pararia
// de responder se déssemos requestPointerLock sem substituir esse cálculo.
// Por isso os dois botões ficam com mouseButtons.LEFT/RIGHT desligados no
// OrbitControls (initScene3D) e são tratados aqui do mesmo jeito que o botão
// do meio já era.
// Guarda se os listeners já foram anexados — chamada de novo em todo
// initScene3D() (que agora roda de novo sempre que a cena é reconstruída
// depois de um disposeScene3D(), ver setViewMode3D/visibilitychange), mas
// os listeners são anexados em elementos que NUNCA são recriados (canvas3d,
// window, document) e leem camera3D/controls3D/dragMode3D dinamicamente a
// cada evento — então só precisam existir uma vez. Sem essa guarda, cada
// reabertura do 3D empilhava mais um conjunto de listeners idênticos por
// cima dos anteriores, fazendo cada movimento de mouse disparar a lógica de
// orbitar/pan/olhar ao redor 2x, 3x, 4x... (câmera parecendo "cada vez mais
// sensível" a cada saída/volta do 3D — bug relatado explicitamente).
let lookAroundControlsSetup3D=false;
function setupLookAroundControls3D(){
  if(lookAroundControlsSetup3D) return;
  lookAroundControlsSetup3D=true;
  const dom=canvas3d;

  dom.addEventListener('contextmenu', e=>e.preventDefault());
  dom.addEventListener('auxclick', e=>{ if(e.button===1) e.preventDefault(); });

  dom.addEventListener('pointerdown', e=>{
    if(e.button!==0 && e.button!==1 && e.button!==2) return;
    try{ dom.setPointerCapture(e.pointerId); }catch(err){}
  });
  function releaseCameraPointer3D(e){
    try{ if(e&&e.pointerId!=null) dom.releasePointerCapture(e.pointerId); }catch(err){}
  }
  dom.addEventListener('pointerup', releaseCameraPointer3D);
  dom.addEventListener('pointercancel', releaseCameraPointer3D);

  function beginDrag3D(mode){
    dragMode3D=mode;
    controls3D.enabled=false;
    dom.style.cursor='none';

    if(mode==='look'){
      lookDistance3D=camera3D.position.distanceTo(controls3D.target)||10;
      const euler=new THREE.Euler().setFromQuaternion(camera3D.quaternion,'YXZ');
      lookYaw3D=euler.y; lookPitch3D=euler.x;
    }

    // Pointer Lock: com o ponteiro travado, o cursor do SO para de se mover
    // de verdade (fica fixo/invisível, escondido automaticamente pelo próprio
    // navegador) e o evento 'mousemove' continua entregando movementX/Y sem
    // depender da posição real na tela. dom.style.cursor='none' acima é só
    // um reforço/fallback pro caso raro do navegador negar o pedido de lock
    // (política de iframe, etc.) — nesse caso o cursor ao menos continua
    // escondido, mesmo sem o benefício de não bater na borda do monitor.
    ignoreNextMove3D=true; // ver comentário na declaração da variável

    // unadjustedMovement:true pede pro navegador entregar o movementX/Y "cru"
    // (sem a curva de aceleração/ballistics do ponteiro do sistema operacional
    // aplicada em cima). SEM isso, o Windows/o driver do mouse aplica uma
    // curva não-linear de aceleração em cima do movimento — em velocidades
    // mais altas ela amplifica o delta de forma desproporcional e depois
    // "solta" — e é exatamente isso que aparecia como a câmera "pulando" no
    // meio do arrasto, com a sensibilidade parecendo disparar e voltar ao
    // normal, sem soltar o botão. Alguns navegadores mais antigos não
    // suportam essa opção — nesses casos ela é simplesmente ignorada (cai de
    // volta pro movementX/Y normal, com a aceleração do SO ainda podendo
    // acontecer ocasionalmente, mas sem quebrar nada).
    try{
      const lockResult=dom.requestPointerLock && dom.requestPointerLock({unadjustedMovement:true});
      // Em navegadores que implementam a versão mais nova da API,
      // requestPointerLock retorna uma Promise que pode rejeitar
      // especificamente por causa da opção unadjustedMovement não ser
      // suportada (NotSupportedError) — nesse caso, tenta de novo sem ela,
      // em vez de deixar o "olhar ao redor"/orbit/pan inteiro quebrado.
      if(lockResult && typeof lockResult.catch==='function'){
        lockResult.catch(()=>{
          try{ dom.requestPointerLock && dom.requestPointerLock(); }catch(err){}
        });
      }
    }catch(err){
      try{ dom.requestPointerLock && dom.requestPointerLock(); }catch(err2){}
    }
  }

  dom.addEventListener('mousedown', e=>{
    // Fecha qualquer painel do 3D (⚙️/🎨/❓) na hora, assim que o usuário
    // clica no canvas pra se mover — não espera o 'click' (mouseup) disparar,
    // porque nesse meio-tempo o arrasto de câmera já começou com o menu
    // ainda cobrindo parte da tela.
    if(typeof closeAll3DPanels==='function') closeAll3DPanels();
    if(dragMode3D) return; // já tem um arrasto em andamento (ex: outro botão)
    if(e.button===0){
      // Modo de "conta-gotas" de textura (armMaterialPicker3D) precisa do
      // clique esquerdo normal (com clientX/Y de verdade) pra funcionar —
      // não sequestra o botão esquerdo pro orbit customizado nesse caso.
      if(pickingMaterialMode3D) return;
      e.preventDefault();
      beginDrag3D('orbit');
    } else if(e.button===1){
      e.preventDefault();
      beginDrag3D('look');
    } else if(e.button===2){
      e.preventDefault();
      beginDrag3D('pan');
    }
  });

  // Se o usuário apertar Esc (o navegador sai do pointer lock sozinho nesse
  // caso) ou o lock cair por qualquer outro motivo enquanto ainda estávamos
  // arrastando, encerra o arrasto de forma limpa em vez de deixar o estado
  // preso achando que o botão ainda está pressionado.
  document.addEventListener('pointerlockchange', ()=>{
    if(document.pointerLockElement===dom){
      // Ver declaração de ignoreNextMove3D: o primeiro movimento reportado
      // logo depois do lock engatar de verdade pode vir com um salto
      // espúrio, então descartamos exatamente esse próximo evento.
      ignoreNextMove3D=true;
    } else if(dragMode3D){
      endDrag3D();
    }
  });
  document.addEventListener('pointerlockerror', ()=>{
    // Pedido de lock falhou (política do navegador, iframe sem permissão,
    // etc.) — o arrasto em si ainda funciona, só sem o benefício de não
    // bater na borda do monitor num arrasto muito longo.
  });

  window.addEventListener('mousemove', e=>{
    if(!dragMode3D) return;
    if(ignoreNextMove3D){ ignoreNextMove3D=false; return; }
    let dx=e.movementX||0, dy=e.movementY||0;
    if(!dx && !dy) return;

    // Rede de segurança independente da causa: nenhum movimento real do
    // mouse entre dois eventos (a cada ~16ms num monitor de 60Hz, menos ainda
    // em monitores mais rápidos) deveria gerar um delta gigante. Isso pega
    // qualquer evento com um valor absurdo (curva de aceleração do SO que
    // escapou do unadjustedMovement, o pulo conhecido do primeiro evento após
    // o lock engatar em navegadores que não disparam 'pointerlockchange' a
    // tempo, etc.) e simplesmente ignora AQUELE evento pontual, sem travar o
    // arrasto — o próximo mousemove volta ao normal.
    const MAX_DELTA_PER_EVENT=350; // bem acima de qualquer flick rápido legítimo
    if(Math.abs(dx)>MAX_DELTA_PER_EVENT || Math.abs(dy)>MAX_DELTA_PER_EVENT) return;

    if(dragMode3D==='look'){
      // Olhar ao redor: gira a câmera em torno de si mesma (yaw/pitch), sem
      // mudar a posição.
      const sensitivity=0.0028;
      lookYaw3D  -= dx*sensitivity;
      lookPitch3D-= dy*sensitivity;
      // Sem limite de verdade aqui (só uma margem mínima de segurança
      // numérica pra nunca cravar EXATAMENTE em ±90°, o que evita qualquer
      // caso extremo de instabilidade na conversão Euler->quaternion) — o
      // usuário pode olhar quase reto pra cima ou pra baixo à vontade.
      const limit=Math.PI/2-0.001;
      lookPitch3D=Math.max(-limit, Math.min(limit, lookPitch3D));

      const euler=new THREE.Euler(lookPitch3D, lookYaw3D, 0, 'YXZ');
      camera3D.quaternion.setFromEuler(euler);

    } else if(dragMode3D==='orbit'){
      // Reproduz rotateLeft/rotateUp do OrbitControls (mesma fórmula/sensação
      // já calibrada: 2*PI*delta/clientHeight, escalado por rotateSpeed),
      // aplicado direto num Spherical em torno do controls3D.target (que
      // nunca muda de lugar nesse modo — só a posição da câmera orbita).
      const rotateSpeed=(controls3D.rotateSpeed!=null)?controls3D.rotateSpeed:1;
      const h=dom.clientHeight||1;
      const thetaDelta=2*Math.PI*(dx*rotateSpeed)/h;
      const phiDelta=2*Math.PI*(dy*rotateSpeed)/h;

      const offset=camera3D.position.clone().sub(controls3D.target);
      const spherical=new THREE.Spherical().setFromVector3(offset);
      spherical.theta-=thetaDelta;
      spherical.phi-=phiDelta;
      spherical.phi=Math.max(controls3D.minPolarAngle, Math.min(controls3D.maxPolarAngle, spherical.phi));
      spherical.makeSafe();
      const newOffset=new THREE.Vector3().setFromSpherical(spherical);
      camera3D.position.copy(controls3D.target).add(newOffset);
      camera3D.lookAt(controls3D.target);

    } else if(dragMode3D==='pan'){
      // Reproduz pan()/panLeft()/panUp() do OrbitControls (screenSpacePanning,
      // que é o padrão): translada câmera + target juntos, na mesma
      // velocidade "sentida" que o pan nativo já tinha (baseada na distância
      // até o target e no FOV, pra não mudar de velocidade conforme o zoom).
      // dx/dy aqui equivalem ao "deltaX/deltaY" que o OrbitControls calcularia
      // a partir de clientX/clientY (mesma unidade/sinal: direita e baixo são
      // positivos), então as fórmulas abaixo são as mesmas de panLeft()/
      // panUp() do original, só trocando a fonte da posição por movementX/Y.
      const panSpeed=(controls3D.panSpeed!=null)?controls3D.panSpeed:1;
      const h=dom.clientHeight||1;
      let targetDistance=camera3D.position.distanceTo(controls3D.target);
      targetDistance*=Math.tan((camera3D.fov/2)*Math.PI/180);

      const panOffset=new THREE.Vector3();
      const xColumn=new THREE.Vector3().setFromMatrixColumn(camera3D.matrix,0);
      const yColumn=new THREE.Vector3().setFromMatrixColumn(camera3D.matrix,1);

      // panLeft(distance): panOffset += xColumn * (-distance)
      const panLeftDistance=2*dx*panSpeed*targetDistance/h;
      panOffset.addScaledVector(xColumn, -panLeftDistance);
      // panUp(distance) com screenSpacePanning=true: panOffset += yColumn * distance
      const panUpDistance=2*dy*panSpeed*targetDistance/h;
      panOffset.addScaledVector(yColumn, panUpDistance);

      camera3D.position.add(panOffset);
      controls3D.target.add(panOffset);
    }
  });

  function endDrag3D(){
    if(!dragMode3D) return;
    const endingMode=dragMode3D;
    dragMode3D=null;

    if(endingMode==='look'){
      // Ao encerrar o "olhar ao redor", o alvo do OrbitControls precisa ser
      // recolocado na frente da câmera pra continuar orbitando corretamente
      // depois (ele tinha ficado parado no lugar de antes do arrasto).
      // O clamp de spherical.phi abaixo usa minPolarAngle/maxPolarAngle —
      // que agora são 0/PI (sem limite, ver initScene3D), então na prática
      // isso virou um no-op. Mantido mesmo assim: é o jeito correto/genérico
      // de calcular esse alvo, e volta a ter efeito automaticamente se algum
      // dia um limite de órbita for reintroduzido, sem precisar mexer aqui.
      const forward=new THREE.Vector3();
      camera3D.getWorldDirection(forward);

      const offsetDir=forward.clone().multiplyScalar(-1); // direção alvo->câmera
      const spherical=new THREE.Spherical().setFromVector3(offsetDir);
      spherical.phi=Math.max(controls3D.minPolarAngle, Math.min(controls3D.maxPolarAngle, spherical.phi));
      spherical.makeSafe();
      const clampedOffsetDir=new THREE.Vector3().setFromSpherical(spherical);

      // Câmera fica exatamente onde estava — só o alvo (técnico, invisível)
      // é que é recolocado numa posição compatível com os limites de órbita.
      controls3D.target.copy(camera3D.position).addScaledVector(clampedOffsetDir, -lookDistance3D);

      controls3D.enabled=true;
      controls3D.update();

      // controls3D.update() reorienta a câmera chamando internamente
      // object.lookAt(target) — e como o alvo acima é só uma aproximação
      // "válida" (pode não estar exatamente na direção que o usuário estava
      // olhando, se algum limite de órbita estiver ativo no momento),
      // sobrescrevemos a rotação com a orientação exata que o usuário deixou
      // (lookYaw3D/lookPitch3D). Isso também evita a instabilidade numérica
      // do lookAt() perto da vertical.
      const euler2=new THREE.Euler(lookPitch3D, lookYaw3D, 0, 'YXZ');
      camera3D.quaternion.setFromEuler(euler2);
    } else {
      controls3D.enabled=true;
    }

    if(document.pointerLockElement===dom){
      try{ document.exitPointerLock && document.exitPointerLock(); }catch(err){}
    }
    dom.style.cursor='';
  }

  window.addEventListener('blur', ()=>{ dom.style.cursor=''; });

  window.addEventListener('mouseup', e=>{
    if((e.button===0&&dragMode3D==='orbit')||(e.button===1&&dragMode3D==='look')||(e.button===2&&dragMode3D==='pan')) endDrag3D();
  });
  window.addEventListener('blur', endDrag3D);
}

// ---- Loop de renderização (só ativo em modo 3D) ---------------------------
function renderLoop3D(){
  raf3D=requestAnimationFrame(renderLoop3D);
  const dt=clock3D?Math.min(clock3D.getDelta(),0.1):0.016;
  applyWASDMovement3D(dt);
  // IMPORTANTE: enquanto qualquer um dos três arrastos customizados estiver
  // ativo (orbitar/pan/olhar — ver setupLookAroundControls3D), NÃO chamar
  // controls3D.update() — ele recalcula a posição/orientação da câmera a
  // partir do estado interno (spherical) do OrbitControls a cada frame,
  // sobrescrevendo o que setamos manualmente no mousemove. Antes isso só
  // protegia o botão do meio; agora orbitar (esquerdo) e pan (direito)
  // também são tratados manualmente, então precisam da mesma proteção.
  if(controls3D && !dragMode3D) controls3D.update();
  // Rede de segurança extra contra a câmera afundar na grama (zoom/dolly ou
  // qualquer outro caminho que não passe pelo maxPolarAngle/WASD).
  if(camera3D && camera3D.position.y < CAMERA_MIN_HEIGHT){
    const diff=CAMERA_MIN_HEIGHT-camera3D.position.y;
    camera3D.position.y=CAMERA_MIN_HEIGHT;
    if(controls3D) controls3D.target.y+=diff;
  }
  if(renderer3D&&scene3D&&camera3D) renderer3D.render(scene3D, camera3D);
}
function startRenderLoop3D(){
  if(raf3D!=null) return;
  if(clock3D) clock3D.getDelta(); // zera o acumulado antes de começar a contar de novo
  renderLoop3D();
}
function stopRenderLoop3D(){
  if(raf3D!=null){ cancelAnimationFrame(raf3D); raf3D=null; }
  moveKeys3D.w=moveKeys3D.a=moveKeys3D.s=moveKeys3D.d=false;
}

// Descarta geometria/material/texturas de um objeto e de toda a sua
// subárvore — mesma lógica de disposal já usada em clearGroup(), só que
// reaproveitável pra qualquer objeto solto (chão, céu), não só grupos.
function disposeObjectDeep3D(obj){
  if(!obj) return;
  obj.traverse(o=>{
    if(o.geometry) o.geometry.dispose();
    if(o.material){
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.forEach(m=>{
        Object.keys(m).forEach(k=>{ if(m[k]&&m[k].isTexture) m[k].dispose(); });
        m.dispose();
      });
    }
  });
}

// ---- Descarrega a cena 3D por completo -------------------------------------
// Libera de verdade a memória de GPU (texturas, geometria, sombras, o
// próprio contexto WebGL) usada pelo 3D, em vez de só pausar o loop de
// renderização — chamado ao voltar pro 2D e quando a aba do navegador fica
// em segundo plano/minimizada com o 3D aberto (ver visibilitychange perto de
// setViewMode3D), pra não deixar nada preso à toa travando o resto do
// computador.
//
// Pedido explícito: descarregar de verdade TUDO (inclusive o cache de
// modelos já baixados) e mostrar a tela de carregamento de novo ao reabrir —
// por isso, diferente de uma versão anterior desta função, modelCache
// também é limpo aqui embaixo: a próxima abertura do 3D refaz o download/
// parse de cada .glb do zero, e rebuildScene3D() já mostra sozinho o
// indicador de carregamento (#stage3dLoading) enquanto isso acontece (ver
// showLoading logo no início dela) — não precisa de nada especial aqui além
// de garantir que o cache esteja mesmo vazio.
//
// dispose() em geometria/material é seguro mesmo pra peças "emprestadas" do
// cache de modelos: ele só libera os buffers de GPU da renderização atual,
// sem impedir que o mesmo objeto seja reenviado à GPU depois — é exatamente
// o que já acontece hoje a cada rebuildScene3D, via
// clearGroup(panelsGroup3D)/clearGroup(wallsGroup3D).
// Aqui só estendemos a mesma limpeza pro resto da cena (chão, céu, árvores,
// blocos) e, além disso, descartamos o renderer/contexto WebGL em si.
//
// initScene3D detecta sceneReady3D=false e recria tudo do zero na próxima
// vez que o 3D for reaberto — o mesmo fluxo de sempre (a câmera já era
// reenquadrada a cada abertura via frameCamera3D, então não existe nenhum
// estado "perdido" com isso).
function disposeScene3D(){
  stopRenderLoop3D();
  if(!sceneReady3D) return;

  try{
    clearGroup(panelsGroup3D);
    clearGroup(wallsGroup3D);
    clearGroup(treesGroup3D);
    clearGroup(blocksGroup3D);
    disposeObjectDeep3D(groundMesh3D);
    disposeObjectDeep3D(skyGroup3D);
    if(hdrTexture3D){ hdrTexture3D.dispose(); hdrTexture3D=null; }
    if(pmremGenerator3D){ pmremGenerator3D.dispose(); pmremGenerator3D=null; }
    if(typeof bakedEnvTexture3D!=='undefined' && bakedEnvTexture3D){ bakedEnvTexture3D.dispose(); bakedEnvTexture3D=null; }
    if(scene3D){ scene3D.environment=null; scene3D.background=null; }

    // IMPORTANTE: só dispose(), sem forceContextLoss(). Perder o contexto de
    // propósito deixa o <canvas> com um contexto "morto" que os navegadores
    // NÃO restauram sozinhos (isso só acontece de verdade quando é o
    // driver/GPU que perde o contexto, não quando é forçado via código) — a
    // próxima vez que abríssemos o 3D, o novo WebGLRenderer reutilizava esse
    // mesmo contexto morto e nada aparecia nunca mais. dispose() sozinho já
    // libera os caches internos do renderer (programas, render lists, mapa
    // de sombra etc.) e, somado ao dispose() explícito de geometria/
    // material/textura acima, libera a memória de GPU sem matar o contexto —
    // o próximo initScene3D() cria um WebGLRenderer novo sobre o mesmo
    // contexto (ainda vivo) normalmente.
    if(renderer3D) renderer3D.dispose();

    if(resizeObserver3D){ resizeObserver3D.disconnect(); resizeObserver3D=null; }
    window.removeEventListener('resize', resizeRenderer3D);

    materialRegistry3D.clear();
    modelCache.clear(); // descarrega os .glb já baixados também — recarrega do zero na próxima abertura
  } finally {
    // Sempre executa, mesmo se algo acima lançar erro — senão sceneReady3D
    // ficaria travado em "true" com a cena meio-destruída, e initScene3D()
    // nunca mais reconstruiria nada (o mesmo sintoma de "não carrega de
    // novo").
    scene3D=null; camera3D=null; renderer3D=null; controls3D=null;
    panelsGroup3D=null; wallsGroup3D=null; groundMesh3D=null; blocksGroup3D=null;
    blockMaterial3D=null; treesGroup3D=null; skyGroup3D=null; sunSprite3D=null;
    sun3D=null; ambientLight3D=null; hemiLight3D=null; fillLight3D=null;
    trunkMaterial3D=null; foliageMaterial3D=null;
    clock3D=null;
    sceneReady3D=false;
  }
}

// Reconstrói a cena 3D do zero (mesmo fluxo do "entrar no 3D" normal) — usado
// quando a aba volta a ficar visível e a cena tinha sido descarregada
// enquanto estava em segundo plano (ver visibilitychange perto de
// setViewMode3D).
function rebuildAndResume3D(){
  initScene3D();
  resizeRenderer3D();
  rebuildScene3D(state).then(()=>{
    if(typeof loadRender3dConfig==='function') loadRender3dConfig(state.render3d);
  });
  startRenderLoop3D();
}

// Teclado do WASD (+ setas, como alternativa) só é escutado quando a aba 3D
// está ativa e o foco não está num campo de texto/select/modal — pra não
// capturar essas teclas enquanto a pessoa está digitando em qualquer outro
// lugar do app. Setas mapeiam pro mesmo moveKeys3D que WASD (ArrowUp=w,
// ArrowLeft=a, ArrowDown=s, ArrowRight=d) — as duas formas funcionam juntas,
// inclusive combinadas (ex: segurar W e ArrowRight ao mesmo tempo).
const ARROW_TO_WASD_3D={ArrowUp:'w', ArrowLeft:'a', ArrowDown:'s', ArrowRight:'d'};
window.addEventListener('keydown', e=>{
  if(state.viewMode!=='3d') return;
  if(is3DTypingTarget(e.target)) return;
  const scrimEl=document.getElementById('scrim');
  if(scrimEl&&scrimEl.classList.contains('show')) return;
  const k=e.key.toLowerCase();
  const arrowK=ARROW_TO_WASD_3D[e.key];
  if(k==='w'||k==='a'||k==='s'||k==='d'){ moveKeys3D[k]=true; e.preventDefault(); }
  if(arrowK){ moveKeys3D[arrowK]=true; e.preventDefault(); }
  if(e.key==='Shift'){ shiftHeld3D=true; }
  // ESPAÇO desacelera (oposto do SHIFT) — preventDefault pra não rolar a
  // página nem "clicar" em algum botão que porventura esteja com foco.
  if(e.code==='Space'||e.key===' '){ spaceHeld3D=true; e.preventDefault(); }
});
window.addEventListener('keyup', e=>{
  const k=e.key.toLowerCase();
  const arrowK=ARROW_TO_WASD_3D[e.key];
  if(k==='w'||k==='a'||k==='s'||k==='d'){ moveKeys3D[k]=false; }
  if(arrowK){ moveKeys3D[arrowK]=false; }
  if(e.key==='Shift'){ shiftHeld3D=false; }
  if(e.code==='Space'||e.key===' '){ spaceHeld3D=false; }
});
// Solta as teclas se a janela perder o foco (alt-tab etc.) pra não "grudar" o movimento.
window.addEventListener('blur', ()=>{ moveKeys3D.w=moveKeys3D.a=moveKeys3D.s=moveKeys3D.d=false; shiftHeld3D=false; spaceHeld3D=false; });

// ---- Switch 2D/3D -----------------------------------------------------------
function setViewMode3D(mode){
  if(mode===state.viewMode) return;
  state.viewMode=mode;

  viewSwitchEl.querySelectorAll('.vbtn').forEach(b=>b.classList.toggle('active', b.dataset.mode===mode));

  const showSvg = mode==='2d';
  svg.style.display = showSvg ? '' : 'none';
  document.querySelector('.tools').style.display = showSvg ? '' : 'none';
  document.querySelector('.zoombar').style.display = showSvg ? '' : 'none';
  document.getElementById('footprint').style.display = showSvg ? '' : 'none';
  const hintEl=document.querySelector('.hint');
  if(hintEl) hintEl.style.display = showSvg ? '' : 'none';
  const selbarEl=document.getElementById('selbar');
  if(selbarEl && showSvg===false) selbarEl.style.display='none';
  // Ao voltar pro 2D, deixa o selbar voltar ao comportamento normal do 2D (ele
  // já controla sua própria visibilidade com base na seleção — só reseta o
  // display inline que forçamos acima).
  if(showSvg && selbarEl) selbarEl.style.removeProperty('display');

  stage3dEl.classList.toggle('show', mode==='3d');

  if(mode==='3d'){
    if(typeof THREE==="undefined"){
      // O script principal é clássico e pode executar antes do módulo ES.
      // Aguarda a Promise do bootstrap em vez de fazer polling indefinido;
      // quando a CSP/rede bloquear uma dependência, mostra a causa resumida.
      toastError('Carregando bibliotecas 3D...');
      state.viewMode='2d';
      let bootstrap=window.__THREE_BOOTSTRAP_PROMISE;
      // Fallback: se o host publicou o app.js mas omitiu o arquivo auxiliar
      // three-bootstrap.js, inicializa os mesmos módulos usando o import map
      // deste documento. O navegador mantém os imports em cache.
      if(!bootstrap){
        bootstrap=window.__THREE_BOOTSTRAP_PROMISE=Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/loaders/DRACOLoader.js'),
          import('three/addons/controls/OrbitControls.js'),
          import('three/addons/loaders/RGBELoader.js')
        ]).then(([THREE_NS, { GLTFLoader }, { DRACOLoader }, { OrbitControls }, { RGBELoader }])=>{
          window.THREE=Object.assign({},THREE_NS,{ GLTFLoader, DRACOLoader, OrbitControls, RGBELoader });
          return window.THREE;
        }).catch(error=>{
          window.__THREE_BOOTSTRAP_ERROR=error;
          throw error;
        });
      }
      if(bootstrap){
        bootstrap.then(()=>{
          if(typeof THREE!=="undefined") setViewMode3D('3d');
          else throw new Error('window.THREE não foi inicializado.');
        }).catch(error=>{
          const detail=error && error.message ? ` (${error.message})` : '';
          toastError(`Não consegui carregar as bibliotecas 3D${detail}`);
        });
      }else{
        let tries=0;
        const wait=setInterval(()=>{
          tries++;
          if(typeof THREE!=="undefined"){ clearInterval(wait); setViewMode3D('3d'); }
          else if(tries>50){ clearInterval(wait); toastError('O módulo Three.js não foi inicializado. Confira a CSP e a conexão.'); }
        },100);
      }
      return;
    }
    // Recolhe o menu lateral (abas + inventário de peças) ao entrar no 3D —
    // ele não serve pra nada nesse modo (não dá pra posicionar painel com o
    // 3D aberto) e só toma espaço da área de visualização. A troca de classe
    // sozinha já dispara a animação via CSS (ver regra "aside.aside-collapsed",
    // desktop apenas — no mobile o aside já é escondido por outro mecanismo).
    const asideEl3D=document.getElementById('aside');
    if(asideEl3D) asideEl3D.classList.add('aside-collapsed');
    initScene3D();
    resizeRenderer3D();
    // Só aplica HDR/presets de textura DEPOIS que a cena termina de
    // carregar de verdade (peças + materiais prontos) — ver
    // loadRender3dConfig/state.render3d. rebuildScene3D() agora devolve uma
    // promise que só resolve nesse ponto (ver comentário na própria função).
    rebuildScene3D(state).then(()=>{
      if(typeof loadRender3dConfig==='function') loadRender3dConfig(state.render3d);
    });
    startRenderLoop3D();
  } else {
    // Volta a mostrar o menu lateral, com a mesma animação, ao voltar pro 2D.
    const asideEl3D=document.getElementById('aside');
    if(asideEl3D) asideEl3D.classList.remove('aside-collapsed');
    // Descarrega a cena de verdade (não só pausa) — ver disposeScene3D. O
    // usuário pediu isso especificamente pra evitar travamentos: reabrir o
    // 3D reconstrói tudo do zero (mesmo fluxo de sempre).
    disposeScene3D();
  }
}

viewSwitchEl.querySelectorAll('.vbtn').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    btn.blur();
    const mode=btn.dataset.mode;
    // Só pergunta a qualidade quando está de fato entrando no 3D vindo de
    // fora dele (2D->3D) — trocar de volta pro 2D ou clicar de novo no "3D"
    // já ativo não precisa perguntar de novo.
    if(mode==='3d' && state.viewMode!=='3d'){
      const escolha = await promptModelQuality3D();
      if(!escolha) return; // cancelou — permanece no 2D
      render3DQuality = escolha;
      if(typeof syncActiveMaterialPresetsBucket3D==='function') syncActiveMaterialPresetsBucket3D();
      if(typeof presetEditQuality3D!=='undefined'){ presetEditQuality3D=escolha; if(typeof updatePresetQualityButtonsUI3D==='function') updatePresetQualityButtonsUI3D(); if(typeof renderPresetList3D==='function') renderPresetList3D(); }
    }
    setViewMode3D(mode);
  });
});

// Descarrega o 3D (libera GPU/memória) quando a aba/janela do navegador é
// minimizada ou perde o foco (troca de aba, outro app em primeiro plano)
// enquanto o 3D está aberto — pedido explícito pra evitar travamentos.
// state.viewMode continua '3d' (a pessoa não "saiu" do 3D de propósito);
// quando a aba volta a ficar visível, a cena é reconstruída automaticamente
// do zero (rebuildAndResume3D), do mesmo jeito que abrir o 3D normalmente.
document.addEventListener('visibilitychange', () => {
  if(document.hidden){
    if(state.viewMode==='3d' && sceneReady3D) disposeScene3D();
  } else {
    if(state.viewMode==='3d' && !sceneReady3D) rebuildAndResume3D();
  }
});

// ---- Switch 1º andar / 2º andar (dentro do 2D) -----------------------------
const floorSwitchEl=document.getElementById('floorSwitch');
function setFloorMode(mode){
  if(mode===state.floorMode)return;
  state.floorMode=mode;
  floorSwitchEl.querySelectorAll('.vbtn').forEach(b=>b.classList.toggle('active', b.dataset.floor===mode));
  // Ferramenta ativa pode não fazer sentido ao trocar de andar (ex: parede
  // armada, que não existe no 2º andar) — volta pra seleção por segurança.
  tool="select";armedType=null;armedWallType=null;ghostPos=null;
  selId=null;selIds=new Set();
  setTool();
  renderInv();render();
}
floorSwitchEl.querySelectorAll('.vbtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{ btn.blur(); setFloorMode(btn.dataset.floor); });
});
// Some visível só no 2D — segue a mesma lógica de exibição do viewSwitch/tools.
(function(){
  const _origSetViewMode3D=setViewMode3D;
  setViewMode3D=function(mode){
    _origSetViewMode3D(mode);
    floorSwitchEl.style.display = (mode==='2d') ? '' : 'none';
  };
})();

// A animação de recolher/expandir o menu lateral (ver setViewMode3D) muda o
// tamanho da área do canvas 2D aos poucos, mas o viewBox do SVG só é
// recalculado quando render() roda — sem isso, a planta 2D fica com o
// enquadramento levemente desatualizado por ~0.4s toda vez que volta do 3D,
// até a próxima interação. Um render() extra assim que a animação termina
// (sem mexer no zoom/pan atual) resolve isso.
document.getElementById('aside').addEventListener('transitionend', e=>{
  if(e.propertyName!=='width') return;
  if(state.viewMode==='2d') render();
});

// ---- Painel de opções de exibição 3D (engrenagem) --------------------------
const view3dSettingsBtn  =document.getElementById('view3dSettingsBtn');
const view3dSettingsPanel=document.getElementById('view3dSettingsPanel');
const v3dShadowsChk      =document.getElementById('v3dShadowsChk');
const v3dShadowQualitySel=document.getElementById('v3dShadowQualitySel');
const v3dAASel           =document.getElementById('v3dAASel');
const v3dReflSel         =document.getElementById('v3dReflSel');
const v3dAmbientSel      =document.getElementById('v3dAmbientSel');
const v3dHdrUrl          =document.getElementById('v3dHdrUrl');
const v3dHdrApply        =document.getElementById('v3dHdrApply');
const v3dHdrClear        =document.getElementById('v3dHdrClear');
const v3dHdrStatus       =document.getElementById('v3dHdrStatus');

v3dShadowsChk.checked=render3DSettings.shadows;
v3dShadowQualitySel.value=render3DSettings.shadowQuality;
v3dAASel.value=render3DSettings.aa;
v3dReflSel.value=render3DSettings.reflectionQuality;
v3dAmbientSel.value=render3DSettings.ambientLevel;

view3dSettingsBtn.addEventListener('click', ()=>{ view3dSettingsPanel.classList.toggle('show'); });
v3dShadowsChk.addEventListener('change', e=>{ render3DSettings.shadows=e.target.checked; applyRender3DSettings(); });
v3dShadowQualitySel.addEventListener('change', e=>{ render3DSettings.shadowQuality=e.target.value; applyRender3DSettings(); });
v3dAASel.addEventListener('change', e=>{ render3DSettings.aa=e.target.value; applyRender3DSettings(); });
v3dReflSel.addEventListener('change', e=>{ render3DSettings.reflectionQuality=e.target.value; applyReflectionQuality(); });
v3dAmbientSel.addEventListener('change', e=>{ render3DSettings.ambientLevel=e.target.value; applyAmbientLevel(); });

v3dHdrApply.addEventListener('click', ()=>{
  const url=(v3dHdrUrl.value||'').trim();
  if(!url){ toastError('Cole o link de um arquivo .hdr público antes de aplicar.'); return; }
  if(!sceneReady3D){ toastError('Abra a aba 3D antes de aplicar um ambiente HDR.'); return; }
  const finalUrl=normalizeAssetUrl(url);
  v3dHdrApply.disabled=true; v3dHdrApply.textContent='Carregando…';
  v3dHdrStatus.textContent='Carregando ambiente HDR...';
  applyHdrEnvironment3D(finalUrl).then(()=>{
    render3DSettings.hdrUrl=finalUrl;
    syncStateRender3D();
    v3dHdrApply.disabled=false; v3dHdrApply.textContent='Aplicar HDR';
    v3dHdrStatus.textContent='HDR aplicado — o sol/reflexo agora vêm da imagem carregada. Grama e árvores continuam ativas.';
    toast('Ambiente HDR aplicado.');
  }).catch(err=>{
    v3dHdrApply.disabled=false; v3dHdrApply.textContent='Aplicar HDR';
    v3dHdrStatus.textContent='Não consegui carregar esse HDR — confira o link (precisa ser .hdr equirretangular público) e tente de novo.';
    toastError('Falha ao carregar o HDR: '+((err&&err.message)||'link inválido ou CORS bloqueado.'));
  });
});
v3dHdrClear.addEventListener('click', ()=>{
  clearHdrEnvironment3D();
  render3DSettings.hdrUrl=null;
  syncStateRender3D();
  v3dHdrUrl.value='';
  v3dHdrStatus.textContent='Sem HDR: usando céu padrão com sol, grama e árvores geradas automaticamente.';
  toast('Voltou pro céu padrão.');
});

// Fecha os três painéis do 3D de uma vez (⚙️ Exibição, 🎨 Texturas, ❓ Ajuda)
// — usada tanto pelo "clicar fora fecha" de cada painel quanto por
// setupLookAroundControls3D (fecha na hora ao começar a orbitar/mover a
// câmera, sem esperar o clique "soltar").
function closeAll3DPanels(){
  if(typeof view3dSettingsPanel!=='undefined' && view3dSettingsPanel) view3dSettingsPanel.classList.remove('show');
  if(typeof view3dHelpPanel!=='undefined' && view3dHelpPanel) view3dHelpPanel.classList.remove('show');
  if(typeof view3dMaterialsPanel!=='undefined' && view3dMaterialsPanel && view3dMaterialsPanel.classList.contains('show')){
    view3dMaterialsPanel.classList.remove('show');
    if(typeof stopPreviewLoop3D==='function') stopPreviewLoop3D();
  }
}

// Fecha o painel ao clicar fora dele (mas não ao clicar na própria engrenagem,
// que já tem seu próprio toggle acima).
document.addEventListener('click', e=>{
  if(!view3dSettingsPanel.classList.contains('show')) return;
  if(view3dSettingsPanel.contains(e.target) || view3dSettingsBtn.contains(e.target)) return;
  view3dSettingsPanel.classList.remove('show');
});

// ---- Painel de ajuda: como navegar na câmera (❓) --------------------------
const view3dHelpBtn  =document.getElementById('view3dHelpBtn');
const view3dHelpPanel=document.getElementById('view3dHelpPanel');
view3dHelpBtn.addEventListener('click', ()=>{ view3dHelpPanel.classList.toggle('show'); });
document.addEventListener('click', e=>{
  if(!view3dHelpPanel.classList.contains('show')) return;
  if(view3dHelpPanel.contains(e.target) || view3dHelpBtn.contains(e.target)) return;
  view3dHelpPanel.classList.remove('show');
});

// ---- Painel de Texturas/Materiais (🎨) --------------------------------
const view3dMaterialsBtn  =document.getElementById('view3dMaterialsBtn');
const view3dMaterialsPanel=document.getElementById('view3dMaterialsPanel');
const v3dMatSelect  =document.getElementById('v3dMatSelect');
const v3dMatHue     =document.getElementById('v3dMatHue');
const v3dMatSat     =document.getElementById('v3dMatSat');
const v3dMatLight   =document.getElementById('v3dMatLight');
const v3dMatRough   =document.getElementById('v3dMatRough');
const v3dMatMetal   =document.getElementById('v3dMatMetal');
const v3dMatHueVal  =document.getElementById('v3dMatHueVal');
const v3dMatSatVal  =document.getElementById('v3dMatSatVal');
const v3dMatLightVal=document.getElementById('v3dMatLightVal');
const v3dMatRoughVal=document.getElementById('v3dMatRoughVal');
const v3dMatMetalVal=document.getElementById('v3dMatMetalVal');
const v3dMatReset   =document.getElementById('v3dMatReset');

// ---- Preview ao vivo da textura selecionada (esfera pequena) --------------
// Usa uma cena/renderer separados, mas atribui o MESMO objeto de material
// (não um clone) — então qualquer ajuste feito nos sliders (que mexem
// direto no material real da cena) já aparece aqui automaticamente, sem
// precisar de nenhuma sincronização manual extra.
let previewScene3D=null, previewCamera3D=null, previewRenderer3D=null, previewMesh3D=null, previewRAF3D=null;
function ensureMaterialPreview3D(){
  if(previewRenderer3D) return;
  const canvas=document.getElementById('v3dMatPreviewCanvas');
  previewRenderer3D=new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
  previewRenderer3D.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  previewRenderer3D.setSize(96,96,false);
  previewScene3D=new THREE.Scene();
  previewCamera3D=new THREE.PerspectiveCamera(35, 1, 0.1, 10);
  previewCamera3D.position.set(0,0,2.6);
  const amb=new THREE.AmbientLight(0xffffff,0.55);
  const key=new THREE.DirectionalLight(0xffffff,1.1);
  key.position.set(2,2,3);
  const rim=new THREE.DirectionalLight(0xbcd4ff,0.35);
  rim.position.set(-2,-1,-2);
  previewScene3D.add(amb, key, rim);
  previewMesh3D=new THREE.Mesh(new THREE.SphereGeometry(1,48,48), new THREE.MeshStandardMaterial({color:0x999999}));
  previewScene3D.add(previewMesh3D);
}
function setPreviewMaterial3D(material){
  ensureMaterialPreview3D();
  previewMesh3D.material=material||new THREE.MeshStandardMaterial({color:0x999999});
  renderPreviewFrame3D();
}
function renderPreviewFrame3D(){
  if(!previewRenderer3D) return;
  if(previewMesh3D) previewMesh3D.rotation.y+=0.012;
  previewRenderer3D.render(previewScene3D, previewCamera3D);
}
function startPreviewLoop3D(){
  ensureMaterialPreview3D();
  if(previewRAF3D!=null) return;
  const loop=()=>{ previewRAF3D=requestAnimationFrame(loop); renderPreviewFrame3D(); };
  loop();
}
function stopPreviewLoop3D(){
  if(previewRAF3D!=null){ cancelAnimationFrame(previewRAF3D); previewRAF3D=null; }
}

view3dMaterialsBtn.addEventListener('click', ()=>{
  const willShow=!view3dMaterialsPanel.classList.contains('show');
  view3dMaterialsPanel.classList.toggle('show', willShow);
  if(willShow){ setPreviewMaterial3D(currentSelectedMaterial3D()); startPreviewLoop3D(); }
  else stopPreviewLoop3D();
});
document.addEventListener('click', e=>{
  if(!view3dMaterialsPanel.classList.contains('show')) return;
  if(view3dMaterialsPanel.contains(e.target) || view3dMaterialsBtn.contains(e.target)) return;
  view3dMaterialsPanel.classList.remove('show');
  stopPreviewLoop3D();
});

function currentSelectedGroup3D(){
  return materialRegistry3D.get(v3dMatSelect.value) || null;
}
// Material "representante" do grupo — usado só pra ler valores atuais (pra
// popular sliders/preview) e pro preview em si. Como todo material de um
// grupo é mantido sincronizado (ver collectSceneMaterials3D/setMaterialHSL
// abaixo), tanto faz qual deles vira o representante.
function firstMaterialOfGroup3D(entry){
  if(!entry) return null;
  return entry.materials.values().next().value || null;
}
function currentSelectedMaterial3D(){
  return firstMaterialOfGroup3D(currentSelectedGroup3D());
}

// Carrega os sliders com os valores atuais do material selecionado.
function loadMaterialSlidersUI(material){
  if(!material){
    [v3dMatHue,v3dMatSat,v3dMatLight,v3dMatRough,v3dMatMetal].forEach(el=>el.disabled=true);
    return;
  }
  [v3dMatHue,v3dMatSat,v3dMatLight,v3dMatRough,v3dMatMetal].forEach(el=>el.disabled=false);
  const p=material.userData.hslParams||{hue:0,sat:1,light:0};
  v3dMatHue.value=Math.round(p.hue*360);
  v3dMatSat.value=Math.round(p.sat*100);
  v3dMatLight.value=Math.round(p.light*100);
  v3dMatRough.value=Math.round((('roughness' in material)?material.roughness:0.6)*100);
  v3dMatMetal.value=Math.round((('metalness' in material)?material.metalness:0)*100);
  v3dMatHueVal.textContent=v3dMatHue.value+'°';
  v3dMatSatVal.textContent=v3dMatSat.value+'%';
  v3dMatLightVal.textContent=v3dMatLight.value+'%';
  v3dMatRoughVal.textContent=v3dMatRough.value+'%';
  v3dMatMetalVal.textContent=v3dMatMetal.value+'%';
}

// Repovoa o <select> de texturas a partir de materialRegistry3D, preservando
// a seleção atual se aquele grupo ainda existir na cena. Chamada ao final de
// cada rebuildScene3D (collectSceneMaterials3D chama isso).
function refreshMaterialsPanelUI(){
  const prevValue=v3dMatSelect.value;
  v3dMatSelect.innerHTML='';
  materialRegistry3D.forEach((entry, key)=>{
    const opt=document.createElement('option');
    opt.value=key; opt.textContent=entry.label;
    v3dMatSelect.appendChild(opt);
  });
  if(materialRegistry3D.has(prevValue)){
    v3dMatSelect.value=prevValue;
  } else if(v3dMatSelect.options.length){
    v3dMatSelect.selectedIndex=0;
  }
  loadMaterialSlidersUI(currentSelectedMaterial3D());
  if(view3dMaterialsPanel.classList.contains('show')) setPreviewMaterial3D(currentSelectedMaterial3D());
}

// Seleciona no painel o grupo de textura ao qual um Material específico
// pertence — usado pelo conta-gotas (clicar no 3D pra escolher a textura).
function selectMaterialGroupByMaterial3D(material){
  let foundKey=null;
  materialRegistry3D.forEach((entry, key)=>{ if(entry.materials.has(material)) foundKey=key; });
  if(!foundKey){
    toastError('Essa textura ainda não apareceu no painel — abra o painel de Texturas e tente de novo.');
    return;
  }
  view3dMaterialsPanel.classList.add('show');
  v3dMatSelect.value=foundKey;
  loadMaterialSlidersUI(currentSelectedMaterial3D());
  setPreviewMaterial3D(currentSelectedMaterial3D());
  startPreviewLoop3D();
  toast('Textura selecionada: '+(materialRegistry3D.get(foundKey)?.label||''));
}

v3dMatSelect.addEventListener('change', ()=>{
  loadMaterialSlidersUI(currentSelectedMaterial3D());
  setPreviewMaterial3D(currentSelectedMaterial3D());
  syncPresetNameFieldToSelection3D();
});

v3dMatHue.addEventListener('input', e=>{
  if(!v3dMatSelect.value) return;
  const hue=parseFloat(e.target.value)/360;
  forEachMaterialInGroup3D(v3dMatSelect.value, m=>setMaterialHSL(m, {hue}));
  v3dMatHueVal.textContent=e.target.value+'°';
});
v3dMatSat.addEventListener('input', e=>{
  if(!v3dMatSelect.value) return;
  const sat=parseFloat(e.target.value)/100;
  forEachMaterialInGroup3D(v3dMatSelect.value, m=>setMaterialHSL(m, {sat}));
  v3dMatSatVal.textContent=e.target.value+'%';
});
v3dMatLight.addEventListener('input', e=>{
  if(!v3dMatSelect.value) return;
  const light=parseFloat(e.target.value)/100;
  forEachMaterialInGroup3D(v3dMatSelect.value, m=>setMaterialHSL(m, {light}));
  v3dMatLightVal.textContent=e.target.value+'%';
});
v3dMatRough.addEventListener('input', e=>{
  if(!v3dMatSelect.value) return;
  const val=parseFloat(e.target.value)/100;
  forEachMaterialInGroup3D(v3dMatSelect.value, m=>{ if('roughness' in m) m.roughness=val; });
  v3dMatRoughVal.textContent=e.target.value+'%';
});
v3dMatMetal.addEventListener('input', e=>{
  if(!v3dMatSelect.value) return;
  const val=parseFloat(e.target.value)/100;
  forEachMaterialInGroup3D(v3dMatSelect.value, m=>{ if('metalness' in m) m.metalness=val; });
  v3dMatMetalVal.textContent=e.target.value+'%';
});
v3dMatReset.addEventListener('click', ()=>{
  if(!v3dMatSelect.value) return;
  forEachMaterialInGroup3D(v3dMatSelect.value, m=>resetMaterialAppearance(m));
  loadMaterialSlidersUI(currentSelectedMaterial3D());
  toast('Textura redefinida pro original.');
});

// ---- Padrão automático por nome de textura --------------------------------
// materialPresetsAll3D = {detalhado:{...}, leve:{...}}. Ver declaração/
// comentário completo lá em cima (junto das outras variáveis de módulo do
// 3D). Persistido no JSON principal da planta (ver serialize()/load()).
const v3dPresetName  =document.getElementById('v3dPresetName');
const v3dPresetSave  =document.getElementById('v3dPresetSave');
const v3dPresetRemove=document.getElementById('v3dPresetRemove');
const v3dPresetStatus=document.getElementById('v3dPresetStatus');
const v3dPresetList  =document.getElementById('v3dPresetList');
const v3dPresetQualityDetalhado=document.getElementById('v3dPresetQualityDetalhado');
const v3dPresetQualityLeve     =document.getElementById('v3dPresetQualityLeve');
const v3dPresetCopyFromDetalhado=document.getElementById('v3dPresetCopyFromDetalhado');

// Qual bucket (leve/detalhado) o painel "Padrão automático por nome" está
// mostrando/editando agora — pode ser diferente da qualidade realmente
// carregada na cena 3D neste momento (render3DQuality), pra dar pra
// configurar presets da qualidade que não está sendo exibida sem precisar
// reabrir o 3D nela. Começa igual à qualidade ativa.
let presetEditQuality3D=render3DQuality;
function presetEditBucket3D(){
  return materialPresetsAll3D[presetEditQuality3D] || (materialPresetsAll3D[presetEditQuality3D]={});
}
function updatePresetQualityButtonsUI3D(){
  if(v3dPresetQualityDetalhado) v3dPresetQualityDetalhado.classList.toggle('primary', presetEditQuality3D==='detalhado');
  if(v3dPresetQualityLeve) v3dPresetQualityLeve.classList.toggle('primary', presetEditQuality3D==='leve');
  // "Copiar do Detalhado" só faz sentido enquanto se está editando o bucket
  // Leve (é pra ONDE a cópia vai) — escondido enquanto o Detalhado está
  // selecionado, pra não sugerir uma cópia "ao contrário".
  if(v3dPresetCopyFromDetalhado) v3dPresetCopyFromDetalhado.style.display = (presetEditQuality3D==='leve') ? '' : 'none';
}
function setPresetEditQuality3D(q){
  if(q===presetEditQuality3D) return;
  presetEditQuality3D=q;
  updatePresetQualityButtonsUI3D();
  renderPresetList3D();
  const editandoAtiva=(presetEditQuality3D===render3DQuality);
  v3dPresetStatus.textContent=editandoAtiva
    ? `Editando presets do modelo ${presetEditQuality3D==='leve'?'Leve':'Detalhado'} (é o que está aberto agora — os ajustes valem na hora).`
    : `Editando presets do modelo ${presetEditQuality3D==='leve'?'Leve':'Detalhado'} — como não é o que está aberto agora, esses ajustes só valem quando você reabrir o 3D nessa qualidade.`;
}
if(v3dPresetQualityDetalhado) v3dPresetQualityDetalhado.addEventListener('click', ()=>setPresetEditQuality3D('detalhado'));
if(v3dPresetQualityLeve) v3dPresetQualityLeve.addEventListener('click', ()=>setPresetEditQuality3D('leve'));
// Copia TODOS os presets do bucket Detalhado pro bucket Leve, substituindo
// o que já estava lá (cópia independente/deep clone — editar um dos dois
// depois não afeta o outro). Pedido explícito do usuário. Se a qualidade
// realmente aberta agora na cena for a Leve, reaplica na hora nos materiais
// já visíveis; senão só fica salvo pra quando o 3D for reaberto como Leve.
if(v3dPresetCopyFromDetalhado) v3dPresetCopyFromDetalhado.addEventListener('click', ()=>{
  const qtdDetalhado=Object.keys(materialPresetsAll3D.detalhado||{}).length;
  if(!qtdDetalhado){ toastError('Não há nenhum preset salvo no Detalhado pra copiar.'); return; }
  materialPresetsAll3D.leve=JSON.parse(JSON.stringify(materialPresetsAll3D.detalhado));
  if(render3DQuality==='leve') syncActiveMaterialPresetsBucket3D(); // realinha o alias materialPresets3D com o novo objeto
  syncStateRender3D();
  renderPresetList3D();
  if(render3DQuality==='leve' && sceneReady3D){
    const matched=reapplyAllMaterialPresets3D();
    if(view3dMaterialsPanel.classList.contains('show')) loadMaterialSlidersUI(currentSelectedMaterial3D());
    toast(`Presets copiados do Detalhado pro Leve (${qtdDetalhado}) — aplicados na cena atual (${matched} material(is)).`);
  } else {
    toast(`Presets copiados do Detalhado pro Leve (${qtdDetalhado}).`);
  }
});
updatePresetQualityButtonsUI3D();

// Sempre que a textura selecionada no dropdown mudar, sugere o nome dela no
// campo — o usuário ainda pode apagar e digitar outro nome livremente (por
// exemplo pra pré-configurar uma textura que ainda nem apareceu na cena).
function syncPresetNameFieldToSelection3D(){
  const entry=currentSelectedGroup3D();
  if(entry && entry.label && !entry.label.startsWith('Material ')) v3dPresetName.value=entry.label;
}

// Lê os valores atuais dos sliders (o que está na tela agora) num objeto de preset.
function readSlidersAsPreset3D(){
  return {
    hue:parseFloat(v3dMatHue.value)/360,
    sat:parseFloat(v3dMatSat.value)/100,
    light:parseFloat(v3dMatLight.value)/100,
    rough:parseFloat(v3dMatRough.value)/100,
    metal:parseFloat(v3dMatMetal.value)/100,
  };
}

// Aplica um preset {hue,sat,light,rough,metal} num Material real já
// patcheado de HSL (ver ensureMaterialHSLPatched). Usado tanto ao salvar
// (aplica na hora pra quem já está na cena) quanto ao carregar a cena/JSON.
function applyMaterialPreset3D(material, preset){
  if(!material||!preset) return;
  setMaterialHSL(material, {hue:preset.hue, sat:preset.sat, light:preset.light});
  if('roughness' in material && preset.rough!=null) material.roughness=preset.rough;
  if('metalness' in material && preset.metal!=null) material.metalness=preset.metal;
}

function renderPresetList3D(){
  const bucket=presetEditBucket3D();
  const names=Object.keys(bucket).sort((a,b)=>a.localeCompare(b));
  if(!names.length){ v3dPresetList.innerHTML=''; return; }
  v3dPresetList.innerHTML=names.map(name=>
    `<div class="v3d-preset-row"><span><b>${esc(name)}</b></span><button type="button" data-preset-del="${esc(name)}" title="Remover">✕</button></div>`
  ).join('');
  v3dPresetList.querySelectorAll('[data-preset-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const name=btn.getAttribute('data-preset-del');
      delete presetEditBucket3D()[name];
      syncStateRender3D();
      renderPresetList3D();
      toast('Padrão de "'+name+'" removido.');
    });
  });
}

v3dPresetSave.addEventListener('click', ()=>{
  const name=(v3dPresetName.value||'').trim();
  if(!name){ toastError('Digite o nome exato da textura antes de salvar.'); return; }
  const preset=readSlidersAsPreset3D();
  presetEditBucket3D()[name]=preset;
  syncStateRender3D();
  renderPresetList3D();
  const editandoAtiva=(presetEditQuality3D===render3DQuality);
  if(editandoAtiva){
    // Só aplica retroativamente na cena ao vivo se o bucket editado é o da
    // qualidade que está realmente aberta agora — editar presets da OUTRA
    // qualidade não deve mexer em nada que está sendo exibido neste momento.
    forEachMaterialInGroup3D('name:'+name, m=>applyMaterialPreset3D(m, preset));
    if(view3dMaterialsPanel.classList.contains('show')) loadMaterialSlidersUI(currentSelectedMaterial3D());
    v3dPresetStatus.textContent='Padrão salvo pra "'+name+'" ('+(presetEditQuality3D==='leve'?'Leve':'Detalhado')+'). Vai ser aplicado automaticamente sempre que essa textura aparecer (inclusive em outras plantas, se salvar o JSON).';
  } else {
    v3dPresetStatus.textContent='Padrão salvo pra "'+name+'" no modelo '+(presetEditQuality3D==='leve'?'Leve':'Detalhado')+' — só entra em vigor quando você abrir o 3D nessa qualidade.';
  }
  toast('Padrão de textura salvo: '+name);
});

v3dPresetRemove.addEventListener('click', ()=>{
  const name=(v3dPresetName.value||'').trim();
  const bucket=presetEditBucket3D();
  if(!name||!(name in bucket)){ toastError('Não existe padrão salvo com esse nome exato.'); return; }
  delete bucket[name];
  syncStateRender3D();
  renderPresetList3D();
  toast('Padrão de "'+name+'" removido.');
});

// Bootstrap eager: popula os buckets de presets (Leve/Detalhado) a partir
// do que já está no projeto carregado (state.render3d) assim que a página
// inicia, sem esperar a primeira abertura da aba 3D (loadRender3dConfig só
// roda nesse momento) — sem isso, um "Salvar" feito antes de abrir o 3D
// pela primeira vez saía só com o antigo "matPresets", sem "matPresetsLeve"
// nenhum, mesmo já existindo a distinção Leve/Detalhado no app.
populateMaterialPresetsAll3D(state.render3d);
presetEditQuality3D=render3DQuality;
updatePresetQualityButtonsUI3D();
// Preserva o hdrUrl que já estava em state.render3d ANTES de sincronizar —
// render3dForSave() lê render3DSettings.hdrUrl (não state.render3d.hdrUrl
// direto), e essa variável só era preenchida dentro de loadRender3dConfig
// (que só roda quando o 3D é aberto pela 1ª vez). Sem esta linha, o
// syncStateRender3D() logo abaixo apagava o hdrUrl do projeto (inclusive o
// HDRI padrão do projeto seed) antes mesmo do 3D ser aberto.
render3DSettings.hdrUrl=(state.render3d && state.render3d.hdrUrl) || null;
syncStateRender3D();
renderPresetList3D();

// ---- Conta-gotas: clicar em qualquer ponto do 3D seleciona a textura dali --
let pickingMaterialMode3D=false;
function armMaterialPicker3D(){
  pickingMaterialMode3D=true;
  canvas3d.style.cursor='crosshair';
  toast('Clique em qualquer parte do chalé (ou do cenário) pra selecionar a textura dali. Esc cancela.');
}
function disarmMaterialPicker3D(){
  pickingMaterialMode3D=false;
  canvas3d.style.cursor='';
}
// pickRaycaster3D é criado sob demanda (lazy) dentro do handler de clique,
// não aqui no topo do script: o <script type="module"> que define window.THREE
// é adiado (comportamento padrão de módulos) e só roda DEPOIS que esse script
// clássico já foi executado — "new THREE.Raycaster()" aqui em cima disparava
// "THREE is not defined" porque ainda não existia nesse momento.
let pickRaycaster3D=null;
canvas3d.addEventListener('click', e=>{
  if(!pickingMaterialMode3D) return;
  disarmMaterialPicker3D();
  if(!pickRaycaster3D) pickRaycaster3D=new THREE.Raycaster();
  const rect=canvas3d.getBoundingClientRect();
  const ndc=new THREE.Vector2(
    ((e.clientX-rect.left)/rect.width)*2-1,
    -((e.clientY-rect.top)/rect.height)*2+1
  );
  pickRaycaster3D.setFromCamera(ndc, camera3D);
  const targets=[panelsGroup3D, wallsGroup3D, treesGroup3D, blocksGroup3D, groundMesh3D].filter(Boolean);
  const hits=pickRaycaster3D.intersectObjects(targets, true);
  const hit=hits.find(h=>h.object && h.object.material);
  if(!hit){ toastError('Nada encontrado nesse ponto — tente clicar direto sobre uma superfície.'); return; }
  const mat=Array.isArray(hit.object.material)?hit.object.material[0]:hit.object.material;
  selectMaterialGroupByMaterial3D(mat);
});
window.addEventListener('keydown', e=>{
  if(pickingMaterialMode3D && e.key==='Escape'){ disarmMaterialPicker3D(); toast('Seleção com conta-gotas cancelada.'); }
});
const v3dMatPickBtn=document.getElementById('v3dMatPickBtn');
if(v3dMatPickBtn) v3dMatPickBtn.addEventListener('click', armMaterialPicker3D);



// Sessão central do SuperApp: o formulário legado de token não é usado.
async function autenticarECarregar() {
  const session = await window.SuperAppAuth.getSession();
  if (!session) return;
  const data = await callRPC('autenticar', {});
  if (!data || !data.ok) return;
  const profile = await window.SuperAppAuth.getProfile();
  document.getElementById('side-user-name').textContent = profile?.display_name || session.user.email || 'Usuário';
  const plantaRoleLabel = profile?.role_name || profile?.role_code || pricingData.perfil || 'Acesso operacional';
  const plantaScopeLabel = profile?.franchise_name ? `Franquia · ${profile.franchise_name}` : profile?.unit_name ? `Matriz · ${profile.unit_name}` : 'Matriz · acesso global';
  document.getElementById('side-user-role').textContent = `${plantaRoleLabel} · ${plantaScopeLabel}`;
  tokenAtivoSessao = 'central-session';
  aplicarPricingData(data);
  const overlay = document.getElementById('authOverlay');
  overlay.classList.add('hidden');
  setTimeout(() => { overlay.style.display = 'none'; }, 450);
  renderInv();
  iniciarPollingPrecos();
  const perfil = pricingData.perfil || '—';
  const icon = perfil === 'Admin' ? '🏛️' : (perfil === 'Gestor Matriz' || perfil === 'Gestor' ? '👔' : '🛒');
  document.getElementById('userPerfilBadge').textContent = icon + ' ' + perfil;
  document.getElementById('userFranquia').textContent = pricingData.franquia || '—';
  document.getElementById('userInfoBar').style.display = 'flex';
  document.getElementById('jsonAdminBtns').style.display = perfil === 'Admin' ? 'flex' : 'none';
}
// Inicia autenticação ao carregar a página
autenticarECarregar();
document.getElementById("authLogo").src = DEFAULT_LOGO;
// Planta: fechamento do preview delegado para compatibilidade com CSP.
document.addEventListener('click', (event) => {
  const target = event.target.closest?.('[data-planta-close-preview]');
  if (!target) return;
  event.preventDefault();
  document.getElementById('previewScrim')?.classList.remove('show');
}); 
// Planta: listeners delegados para templates compatíveis com CSP.
(function instalarListenersPlantaCsp() {
  const closest = (event, selector) => event.target?.closest?.(selector);

  document.addEventListener('click', (event) => {
    const stopTarget = closest(event, '[data-planta-stop-propagation]');
    if (stopTarget) event.stopPropagation();

    const adjust = closest(event, '[data-planta-q-adjust]');
    if (adjust) {
      event.preventDefault();
      qAjustarQtd(
        adjust.getAttribute('data-planta-q-adjust') || '',
        Number(adjust.getAttribute('data-planta-q-delta') || 0)
      );
      return;
    }

    const pdf = closest(event, '[data-planta-pdf]');
    if (pdf) {
      event.preventDefault();
      gerarPDFOrcamento(pdf.getAttribute('data-planta-pdf') || 'preview');
      return;
    }

    const action = closest(event, '[data-planta-action]');
    if (!action) return;
    event.preventDefault();

    switch (action.getAttribute('data-planta-action')) {
      case 'open-margins': abrirConfigMargens(); break;
      case 'open-insumos': abrirConfigInsumos(); break;
      case 'close-modal': closeModal(); break;
      case 'close-gestor': document.getElementById('gestorOverlay')?.classList.remove('show'); break;
      case 'add-avulso': qAdicionarAvulso(); break;
      case 'add-insumo-avulso': qAdicionarInsumoAvulso(); break;
      case 'clear-adjustments': qLimparAjustes(); break;
      case 'view-panels': qSetViewTab('paineis'); break;
      case 'view-insumos': qSetViewTab('insumos'); break;
      default: break;
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target?.matches?.('[data-planta-toggle-industria]')) {
      qToggleCompraIndustria(
        target.getAttribute('data-planta-toggle-industria') || '',
        Boolean(target.checked)
      );
    }
    if (target?.matches?.('[data-planta-apply-discount]')) qAplicarDesconto();
  });

  document.addEventListener('blur', (event) => {
    const target = event.target;
    if (target?.matches?.('[data-planta-q-set]')) {
      qDefinirQtd(
        target.getAttribute('data-planta-q-set') || '',
        Number(target.getAttribute('data-planta-q-base') || 0),
        target.value
      );
    }
    if (target?.matches?.('[data-planta-q-price]')) {
      qAjustarPreco(
        target.getAttribute('data-planta-q-price') || '',
        target.value
      );
    }
    if (target?.matches?.('[data-planta-apply-discount]')) qAplicarDesconto();
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const target = event.target;
    if (!target?.matches?.('[data-planta-enter-commit]')) return;
    event.preventDefault();
    target.blur();
  });
})(); 
// Planta: aplicação segura de swatches dinâmicos com whitelist de backgrounds.
(function instalarSwatchesPlantaCsp() {
  const allowedBackground = /^(?:#[0-9a-f]{3,8}|linear-gradient\(180deg,\s*#[0-9a-f]{3,8}\s+50%,\s*#[0-9a-f]{3,8}\s+50%\)|repeating-linear-gradient\(180deg,\s*#[0-9a-f]{3,8}\s+0,\s*#[0-9a-f]{3,8}\s+3px,\s*#[0-9a-f]{3,8}\s+3px,\s*#[0-9a-f]{3,8}\s+4px\))$/i;

  const apply = (element) => {
    const raw = element.getAttribute('data-planta-swatch') || '';
    const match = raw.match(/^background\s*:\s*(.+)$/i);
    if (!match || !allowedBackground.test(match[1].trim())) return;
    element.style.setProperty('background', match[1].trim());
  };

  const scan = (root) => {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches?.('[data-planta-swatch]')) apply(root);
    root.querySelectorAll?.('[data-planta-swatch]').forEach(apply);
  };

  scan(document.documentElement);
  new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach(scan));
  }).observe(document.documentElement, { childList: true, subtree: true });
})();