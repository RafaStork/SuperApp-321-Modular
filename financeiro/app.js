
// ═══════════════════════════════════════════════════
// SUPABASE — conexão e autenticação simples (usuário + token)
// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// LOGO E TEMA (claro/escuro)
// ═══════════════════════════════════════════════════
const LOGO_321 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FtYWRhXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDMzOC40NSAxMDcuOTUiPgo8Zz4KICAgIDxwYXRoIGZpbGw9IiNlZDZiMWQiIGQ9Ik01Ni40MiwxMDYuMjdjLS4zNywwLS43NCwwLTEuMTEtLjAycy0uNzQtLjAzLTEuMTEtLjA2LS43NC0uMDYtMS4xLS4wOS0uNzMtLjA4LTEuMS0uMTMtLjczLS4xLTEuMS0uMTctLjczLS4xMy0xLjEtLjItLjczLS4xNS0xLjEtLjI0LS43My0uMTgtMS4wOS0uMjhjLS4zNi0uMS0uNzItLjItMS4wNy0uMzFzLS42OS0uMjItMS4wMy0uMzQtLjY3LS4yNC0uOTktLjM3LS42NC0uMjctLjk1LS40MS0uNjEtLjI5LS45MS0uNDQtLjU4LS4zMS0uODYtLjQ3LS41NS0uMzMtLjgyLS41LS41My0uMzUtLjc4LS41M2wuNDgtLjk0LjQ4LS45NC40OC0uOTQuNDgtLjk0LjQ4LS45NC40OC0uOTQuNDgtLjk0LjQ4LS45NGMuMi4xNS40MS4yOS42Mi40M3MuNDMuMjcuNjQuNDEuNDQuMjYuNjcuMzguNDYuMjQuNjkuMzYuNDcuMjMuNzIuMzQuNDkuMjEuNzQuMzIuNTEuMi43Ny4yOS41Mi4xOC43OS4yN2MuMjcuMDkuNTQuMTcuODEuMjRzLjU0LjE1LjgxLjIxLjU0LjEyLjgxLjE4LjU0LjEuODEuMTUuNTQuMDguODEuMTEuNTQuMDYuODIuMDguNTQuMDQuODIuMDUuNTUuMDIuODIuMDJjLjMxLDAsLjYxLDAsLjktLjAycy41OC0uMDQuODUtLjA3LjU0LS4wNy44LS4xMS41MS0uMS43NS0uMTYuNDgtLjEzLjctLjIxLjQ0LS4xNi42NS0uMjUuNDEtLjE5LjYxLS4zLjM4LS4yMi41Ni0uMzRjLjE4LS4xMi4zNC0uMjUuNS0uMzhzLjMtLjI3LjQzLS40Mi4yNS0uMjkuMzctLjQ1LjIxLS4zMi4zLS40OC4xNy0uMzQuMjMtLjUyLjEyLS4zNi4xNy0uNTUuMDgtLjM5LjEtLjU5LjAzLS40MS4wMy0uNjIsMC0uNC0uMDMtLjU5LS4wNS0uMzgtLjA5LS41Ni0uMDktLjM2LS4xNS0uNTMtLjEzLS4zNC0uMjEtLjQ5LS4xNy0uMzEtLjI2LS40Ni0uMjEtLjI5LS4zMi0uNDMtLjI1LS4yNy0uMzgtLjQtLjI4LS4yNS0uNDQtLjM3Yy0uMTYtLjEyLS4zMy0uMjMtLjUxLS4zM3MtLjM3LS4yLS41OC0uMjgtLjQyLS4xNy0uNjUtLjI0LS40Ny0uMTQtLjcyLS4yLS41Mi0uMTEtLjgtLjE1LS41Ny0uMDgtLjg3LS4xMS0uNjEtLjA1LS45NC0uMDctLjY2LS4wMi0xLjAxLS4wMmgtNC40OXYtNi41bDEuNDgtMS42OCwxLjQ4LTEuNjgsMS40OC0xLjY4LDEuNDgtMS42OCwxLjQ4LTEuNjgsMS40OC0xLjY4LDEuNDgtMS42OCwxLjQ4LTEuNjguMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDQuMTQuNDRoLTIyLjI5di03LjloMjkuNzZ2Ni4zOGwtMS40NywxLjY4LTEuNDcsMS42OC0xLjQ3LDEuNjgtMS40NywxLjY4LTEuNDcsMS42OC0xLjQ3LDEuNjgtMS40NywxLjY4LTEuNDcsMS42OC0uNjItLjM2LS42Mi0uMzYtLjYyLS4zNi0uNjItLjM2LS42Mi0uMzYtLjYyLS4zNi0uNjItLjM2LS42Mi0uMzZoMi44NWMuNjUsMCwxLjI5LjAyLDEuOS4wNnMxLjIxLjA5LDEuNzguMTcsMS4xMy4xNywxLjY2LjI4LDEuMDUuMjQsMS41NC4zOS45Ny4zMSwxLjQyLjUuODkuMzksMS4zLjYxLjgxLjQ2LDEuMTguNzIuNzMuNTMsMS4wNi44M2MuMzMuMjkuNjUuNi45NC45MXMuNTYuNjQuODEuOTcuNDguNjguNjksMS4wNC40LjcyLjU2LDEuMS4zMS43Ni40NCwxLjE2LjIzLjgxLjMxLDEuMjMuMTUuODUuMTksMS4yOS4wNi44OS4wNiwxLjM1YzAsLjMsMCwuNTktLjAzLjg5cy0uMDUuNTktLjA5Ljg3LS4wOS41OC0uMTUuODYtLjEzLjU3LS4yMS44NS0uMTcuNTYtLjI2LjgzLS4yMS41NS0uMzIuODItLjI1LjU0LS4zOC44LS4yOC41My0uNDQuNzljLS4xNi4yNi0uMzIuNTItLjUuNzZzLS4zNy40OS0uNTYuNzMtLjQxLjQ3LS42My42OS0uNDUuNDQtLjY5LjY1LS40OS40Mi0uNzUuNjItLjUzLjM5LS44Mi41OC0uNTcuMzctLjg4LjU0LS42Mi4zNC0uOTQuNWMtLjMyLjE2LS42Ni4zMS0xLjAxLjQ2cy0uNy4yNy0xLjA3LjM5LS43NS4yMy0xLjE0LjMzLS44LjE5LTEuMjEuMjctLjg0LjE1LTEuMjguMjEtLjg5LjExLTEuMzUuMTUtLjkzLjA3LTEuNDIuMDktLjk4LjAzLTEuNDguMDNaIi8+CiAgICA8cGF0aCBmaWxsPSIjZjliMjE1IiBkPSJNNzcuOTIsMTA1LjU0di02LjM4bDIuMDUtMS45NCwyLjA1LTEuOTQsMi4wNS0xLjk0LDIuMDUtMS45NCwyLjA1LTEuOTQsMi4wNS0xLjk0LDIuMDUtMS45NCwyLjA1LTEuOTRjLjE2LS4xNS4zMi0uMjkuNDctLjQzcy4zLS4yOC40NC0uNDIuMjgtLjI4LjQxLS40MS4yNS0uMjcuMzctLjQuMjMtLjI2LjM0LS4zOS4yMS0uMjUuMzEtLjM4LjE5LS4yNS4yOC0uMzcuMTctLjI0LjI0LS4zNmMuMDgtLjEyLjE1LS4yMy4yMi0uMzVzLjE0LS4yMy4yLS4zNC4xMi0uMjIuMTgtLjMzLjExLS4yMi4xNi0uMzIuMS0uMjEuMTUtLjMyLjA5LS4yMS4xMy0uMzEuMDgtLjIuMTEtLjMuMDYtLjIuMDktLjI5Yy4wMy0uMS4wNS0uMTkuMDgtLjI5cy4wNS0uMTkuMDctLjI4LjA0LS4xOC4wNi0uMjcuMDMtLjE4LjA1LS4yNy4wMy0uMTguMDQtLjI2LjAyLS4xNy4wMy0uMjYuMDEtLjE3LjAyLS4yNSwwLS4xNiwwLS4yNWMwLS4yMSwwLS40Mi0uMDMtLjYycy0uMDUtLjM5LS4wOC0uNTgtLjA4LS4zNy0uMTQtLjU1LS4xMi0uMzQtLjE5LS41MS0uMTUtLjMyLS4yNC0uNDctLjE5LS4zLS4zLS40My0uMjMtLjI3LS4zNS0uNC0uMjYtLjI1LS40MS0uMzYtLjMtLjIyLS40Ni0uMzItLjMzLS4xOS0uNTEtLjI4LS4zNi0uMTYtLjU2LS4yMy0uNC0uMTQtLjYxLS4xOS0uNDMtLjExLS42Ni0uMTUtLjQ2LS4wOC0uNzEtLjExLS41LS4wNS0uNzYtLjA2LS41My0uMDItLjgxLS4wMmMtLjIyLDAtLjQ0LDAtLjY2LjAycy0uNDQuMDMtLjY1LjA1LS40My4wNS0uNjQuMDgtLjQyLjA3LS42Mi4xMS0uNDEuMDktLjYxLjE1LS40LjExLS42LjE4LS4zOS4xMy0uNTkuMjEtLjM5LjE2LS41OC4yNGMtLjE5LjA5LS4zOC4xOC0uNTYuMjhzLS4zNi4yLS41NC4zMS0uMzUuMjMtLjUxLjM1LS4zMy4yNS0uNDkuMzgtLjMyLjI3LS40Ny40Mi0uMy4zLS40NS40Ni0uMjkuMzItLjQzLjQ5LS4yNy4zNS0uNDEuNTNsLS45LS41OC0uOS0uNTgtLjktLjU4LS45LS41OC0uOS0uNTgtLjktLjU4LS45LS41OC0uOS0uNThjLjItLjMuNDEtLjYuNjQtLjg5cy40Ni0uNTcuNy0uODQuNS0uNTQuNzYtLjc5LjU0LS41LjgyLS43NC41OC0uNDcuODgtLjcuNjItLjQ0Ljk0LS42NS42Ni0uNDEsMS0uNi43LS4zOCwxLjA2LS41NmMuMzYtLjE4Ljc0LS4zNCwxLjExLS41cy43Ni0uMywxLjE2LS40My43OS0uMjUsMS4yLS4zNy44Mi0uMjEsMS4yNC0uMy44NS0uMTcsMS4yOC0uMjMuODgtLjEyLDEuMzItLjE3LjktLjA4LDEuMzYtLjEuOTMtLjAzLDEuNDEtLjAzYy4zOSwwLC43OCwwLDEuMTcuMDJzLjc2LjA0LDEuMTMuMDcuNzMuMDcsMS4wOS4xMi43MS4xLDEuMDUuMTcuNjguMTQsMS4wMi4yMi42Ni4xNy45OC4yNy42NC4yLjk0LjMxLjYxLjIzLjkxLjM2Yy4zLjEzLjU4LjI2Ljg2LjQxcy41NS4yOS44MS40NS41Mi4zMi43Ni40OC40OS4zNC43Mi41Mi40NS4zNy42Ny41Ni40Mi4zOS42Mi42LjM5LjQyLjU3LjY0LjM1LjQ1LjUyLjY4Yy4xNi4yMy4zMi40Ny40Ni43MnMuMjguNDkuNC43NS4yNC41Mi4zNC43OC4yLjU0LjI4LjgyLjE1LjU2LjIyLjg1LjExLjU5LjE1Ljg5LjA3LjYxLjA5LjkyLjAzLjYzLjAzLjk1YzAsLjE3LDAsLjM0LDAsLjUycy0uMDEuMzQtLjAyLjUxLS4wMi4zNC0uMDQuNTEtLjA0LjM0LS4wNi41MS0uMDUuMzQtLjA3LjUxLS4wNi4zNC0uMDkuNTEtLjA3LjM0LS4xLjUxLS4wOC4zNC0uMTIuNTFjLS4wNC4xNy0uMDkuMzQtLjE1LjUxcy0uMTEuMzQtLjE4LjUyLS4xMy4zNS0uMjEuNTMtLjE2LjM1LS4yNC41My0uMTguMzYtLjI3LjU0LS4yLjM2LS4zMS41NS0uMjIuMzctLjM0LjU1LS4yNC4zNy0uMzcuNTZjLS4xMy4xOS0uMjcuMzgtLjQxLjU3cy0uMy4zOS0uNDUuNTktLjMzLjQtLjUuNi0uMzUuNDEtLjU0LjYyLS4zOC40Mi0uNTkuNjQtLjQxLjQzLS42My42Ni0uNDQuNDUtLjY4LjY3LS40Ny40Ni0uNzIuNjlsLTEuNywxLjYtMS43LDEuNi0xLjcsMS42LTEuNywxLjYtMS43LDEuNi0xLjcsMS42LTEuNywxLjYtMS43LDEuNi0uMjQtLjQ1LS4yNC0uNDUtLjI0LS40NS0uMjQtLjQ1LS4yNC0uNDUtLjI0LS40NS0uMjQtLjQ1LS4yNC0uNDVoMjMuOTl2OC4wMmgtMzIuMTNaIi8+CiAgICA8cGF0aCBmaWxsPSIjMmQ1ZGE5IiBkPSJNMTIwLjY4LDEwNS41NHYtMzguODdsNC4yNSw0LjI1aC0xMi43NnYtNy45aDE4LjM0djQyLjUyaC05Ljg0WiIvPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0xNzEuNDgsNjMuMmgzLjU4Yy40NCwwLC42Ni4yNy42Ni44djQxLjMyYzAsLjUzLS4yMi44LS42Ni44aC0xLjkyYy0uNDksMC0uNzMtLjI3LS43My0uOHYtMzYuOThoLS4yN2wtMTEuNzQsMjcuN2MtLjI3LjQ5LS42LjczLS45OS43M2gtMi4xOWMtLjQ0LDAtLjc1LS4yNC0uOTMtLjczbC0xMS45My0yNy43N2gtLjI3djM3LjA1YzAsLjUzLS4yMi44LS42Ni44aC0xLjkyYy0uNDQsMC0uNjYtLjI3LS42Ni0uOHYtNDEuMzJjMC0uNTMuMjItLjguNjYtLjhoMy41OGMuMzEsMCwuNTEuMTMuNi40bDEyLjQ2LDI5LjMxaC4yN2wxMi40Ni0yOS4zMWMuMDktLjI3LjI5LS40LjYtLjRaIi8+CiAgICA8cGF0aCBmaWxsPSIjMWYzMzFjIiBkPSJNMTk4LjM1LDEwNi4xM2gtNi4xOGMtLjI3LDAtLjU0LS4wMS0uOC0uMDNzLS41MS0uMDUtLjc1LS4wOS0uNDgtLjA5LS43MS0uMTUtLjQ1LS4xMy0uNjctLjIxLS40Mi0uMTctLjYyLS4yNy0uMzktLjIxLS41OC0uMzMtLjM2LS4yNS0uNTQtLjM5LS4zNC0uMjktLjQ5LS40NWMtLjE2LS4xNi0uMy0uMzMtLjQ0LS41cy0uMjctLjM2LS4zOC0uNTUtLjIzLS4zOS0uMzItLjU5LS4xOS0uNDItLjI3LS42NC0uMTUtLjQ1LS4yMS0uNjgtLjExLS40OC0uMTUtLjcyLS4wNy0uNTEtLjA5LS43Ny0uMDMtLjUzLS4wMy0uODF2LTE4LjE3YzAtLjI4LDAtLjU1LjAzLS44MXMuMDUtLjUyLjA5LS43Ny4wOS0uNDkuMTUtLjcyLjEzLS40Ni4yMS0uNjguMTctLjQzLjI3LS42NC4yMS0uNC4zMi0uNTkuMjUtLjM3LjM4LS41NS4yOC0uMzQuNDQtLjVjLjE2LS4xNi4zMi0uMzEuNDktLjQ1cy4zNS0uMjcuNTQtLjM5LjM4LS4yMy41OC0uMzMuNDEtLjE5LjYyLS4yNy40NC0uMTUuNjctLjIxLjQ3LS4xMS43MS0uMTUuNDktLjA3Ljc1LS4wOS41Mi0uMDMuOC0uMDNoNi4xOGMuMjcsMCwuNTQuMDEuOC4wM3MuNTEuMDUuNzUuMDkuNDguMDkuNzEuMTUuNDUuMTMuNjcuMjEuNDIuMTcuNjIuMjcuMzkuMjEuNTguMzMuMzYuMjUuNTQuMzkuMzQuMjkuNDkuNDVjLjE2LjE2LjMuMzMuNDQuNXMuMjcuMzYuMzguNTUuMjMuMzkuMzIuNTkuMTkuNDIuMjcuNjQuMTUuNDUuMjEuNjguMTEuNDguMTUuNzIuMDcuNTEuMDkuNzcuMDMuNTMuMDMuODF2MTguMTdjMCwuMjgsMCwuNTUtLjAzLjgxcy0uMDUuNTItLjA5Ljc3LS4wOS40OS0uMTUuNzItLjEzLjQ2LS4yMS42OC0uMTcuNDMtLjI3LjY0LS4yMS40LS4zMi41OS0uMjUuMzctLjM4LjU1LS4yOC4zNC0uNDQuNWMtLjE2LjE2LS4zMi4zMS0uNDkuNDVzLS4zNS4yNy0uNTQuMzktLjM4LjIzLS41OC4zMy0uNDEuMTktLjYyLjI3LS40NC4xNS0uNjcuMjEtLjQ3LjExLS43MS4xNS0uNDkuMDctLjc1LjA5LS41Mi4wMy0uOC4wM1pNMTkyLjM3LDEwMy44NWg1LjczYy4xOSwwLC4zOCwwLC41Ni0uMDJzLjM2LS4wMy41My0uMDYuMzMtLjA2LjQ5LS4xLjMxLS4wOS40Ni0uMTQuMjktLjExLjQzLS4xOC4yNy0uMTQuMzktLjIyLjI0LS4xNy4zNi0uMjYuMjItLjE5LjMyLS4zYy4xLS4xMS4yLS4yMi4yOS0uMzRzLjE3LS4yNC4yNS0uMzguMTUtLjI3LjIxLS40MS4xMi0uMjkuMTctLjQ1LjEtLjMyLjEzLS40OC4wNy0uMzQuMS0uNTIuMDQtLjM2LjA2LS41NS4wMi0uMzkuMDItLjU5di0xNy45N2MwLS4yLDAtLjQtLjAyLS41OXMtLjAzLS4zOC0uMDYtLjU1LS4wNi0uMzUtLjEtLjUyLS4wOC0uMzMtLjEzLS40OC0uMTEtLjMtLjE3LS40NS0uMTMtLjI4LS4yMS0uNDEtLjE2LS4yNi0uMjUtLjM4LS4xOS0uMjMtLjI5LS4zNGMtLjEtLjExLS4yMS0uMjEtLjMyLS4zcy0uMjMtLjE4LS4zNi0uMjYtLjI2LS4xNS0uMzktLjIyLS4yOC0uMTMtLjQzLS4xOC0uMy0uMS0uNDYtLjE0LS4zMi0uMDctLjQ5LS4xLS4zNS0uMDUtLjUzLS4wNi0uMzctLjAyLS41Ni0uMDJoLTUuNzNjLS4xOSwwLS4zOCwwLS41Ni4wMnMtLjM2LjAzLS41My4wNi0uMzMuMDYtLjQ5LjEtLjMxLjA5LS40Ni4xNC0uMjkuMTItLjQyLjE5LS4yNi4xNC0uMzkuMjMtLjI0LjE3LS4zNS4yNy0uMjIuMi0uMzIuMzFjLS4xLjExLS4xOS4yMy0uMjguMzVzLS4xNy4yNS0uMjUuMzgtLjE0LjI3LS4yMS40MS0uMTIuMjktLjE3LjQ1LS4wOS4zMS0uMTMuNDgtLjA3LjM0LS4wOS41MS0uMDQuMzYtLjA2LjU0LS4wMi4zOC0uMDIuNTh2MTcuOTdjMCwuMiwwLC4zOS4wMi41OHMuMDMuMzcuMDYuNTQuMDYuMzUuMDkuNTEuMDguMzIuMTMuNDguMTEuMy4xNy40NS4xMy4yOC4yMS40MS4xNi4yNi4yNS4zOC4xOC4yNC4yOC4zNWMuMS4xMS4yMS4yMS4zMi4zMXMuMjMuMTkuMzUuMjcuMjUuMTYuMzkuMjMuMjguMTMuNDIuMTkuMy4xLjQ2LjE0LjMyLjA4LjQ5LjEuMzUuMDUuNTMuMDYuMzcuMDIuNTYuMDJaIi8+CiAgICA8cGF0aCBmaWxsPSIjMWYzMzFjIiBkPSJNMjEzLjQ0LDEwNS41MnYtMzEuMzNjMC0uMDUsMC0uMSwwLS4xNHMuMDEtLjA5LjAyLS4xMi4wMi0uMDcuMDQtLjEuMDMtLjA2LjA1LS4wOS4wNC0uMDUuMDctLjA3LjA2LS4wMy4wOS0uMDUuMDctLjAyLjEtLjAzLjA4LDAsLjEyLDBoMTIuNDJjLjI3LDAsLjU0LjAxLjguMDNzLjUxLjA1Ljc1LjA5LjQ4LjA5LjcxLjE1LjQ1LjEzLjY3LjIxLjQyLjE3LjYyLjI3LjM5LjIxLjU4LjMzLjM2LjI1LjU0LjM5LjM0LjI5LjQ5LjQ1Yy4xNi4xNi4zLjMzLjQ0LjVzLjI3LjM2LjM4LjU1LjIzLjM5LjMyLjU5LjE5LjQyLjI3LjY0LjE1LjQ1LjIxLjY4LjExLjQ4LjE1LjcyLjA3LjUxLjA5Ljc3LjAzLjUzLjAzLjgxdjE4LjE3YzAsLjI4LDAsLjU1LS4wMy44MXMtLjA1LjUyLS4wOS43Ny0uMDkuNDktLjE1LjcyLS4xMy40Ni0uMjEuNjgtLjE3LjQzLS4yNy42NC0uMjEuNC0uMzIuNTktLjI1LjM3LS4zOC41NS0uMjguMzQtLjQ0LjVjLS4xNi4xNi0uMzIuMzEtLjQ5LjQ1cy0uMzUuMjctLjU0LjM5LS4zOC4yMy0uNTguMzMtLjQxLjE5LS42Mi4yNy0uNDQuMTUtLjY3LjIxLS40Ny4xMS0uNzEuMTUtLjQ5LjA3LS43NS4wOS0uNTIuMDMtLjguMDNoLTEyLjQycy0uMDgsMC0uMTIsMC0uMDctLjAyLS4xLS4wMy0uMDYtLjAzLS4wOS0uMDUtLjA1LS4wNC0uMDctLjA3LS4wNC0uMDUtLjA1LS4wOS0uMDMtLjA3LS4wNC0uMS0uMDItLjA4LS4wMi0uMTIsMC0uMDksMC0uMTRaTTIxNi40NSwxMDMuODVoOS42NWMuMTksMCwuMzgsMCwuNTYtLjAycy4zNi0uMDMuNTMtLjA2LjMzLS4wNi40OS0uMS4zMS0uMDkuNDYtLjE0LjI5LS4xMS40My0uMTguMjctLjE0LjM5LS4yMi4yNC0uMTcuMzYtLjI2LjIyLS4xOS4zMi0uM2MuMS0uMTEuMi0uMjIuMjktLjM0cy4xNy0uMjQuMjUtLjM4LjE1LS4yNy4yMS0uNDEuMTItLjI5LjE3LS40NS4xLS4zMi4xMy0uNDguMDctLjM0LjEtLjUyLjA0LS4zNi4wNi0uNTUuMDItLjM5LjAyLS41OXYtMTcuOTdjMC0uMiwwLS40LS4wMi0uNTlzLS4wMy0uMzgtLjA2LS41NS0uMDYtLjM1LS4xLS41Mi0uMDgtLjMzLS4xMy0uNDgtLjExLS4zLS4xNy0uNDUtLjEzLS4yOC0uMjEtLjQxLS4xNi0uMjYtLjI1LS4zOC0uMTktLjIzLS4yOS0uMzRjLS4xLS4xMS0uMjEtLjIxLS4zMi0uM3MtLjIzLS4xOC0uMzYtLjI2LS4yNi0uMTUtLjM5LS4yMi0uMjgtLjEzLS40My0uMTgtLjMtLjEtLjQ2LS4xNC0uMzItLjA3LS40OS0uMS0uMzUtLjA1LS41My0uMDYtLjM3LS4wMi0uNTYtLjAyaC05LjY1cy0uMDgsMC0uMTIsMC0uMDcuMDEtLjEuMDItLjA2LjAyLS4wOS4wNC0uMDUuMDMtLjA3LjA1LS4wNC4wNC0uMDUuMDYtLjAzLjA1LS4wNC4wOC0uMDIuMDYtLjAyLjA5LDAsLjA3LDAsLjExdjI3LjA4czAsLjA3LDAsLjExLjAxLjA2LjAyLjA5LjAyLjA1LjA0LjA4LjAzLjA1LjA1LjA2LjA0LjA0LjA3LjA1LjA1LjAzLjA5LjA0LjA3LjAyLjEuMDIuMDgsMCwuMTIsMFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0yNTguOTMsNzMuNThoMS40MXMuMDksMCwuMTMsMCwuMDguMDEuMTEuMDMuMDcuMDMuMS4wNC4wNS4wNC4wOC4wNi4wNC4wNS4wNi4wOC4wMy4wNi4wNC4xLjAyLjA3LjAzLjExLDAsLjA4LDAsLjEzdjI0LjhjMCwuMjgsMCwuNTUtLjAzLjgxcy0uMDUuNTItLjA5Ljc3LS4wOS40OS0uMTUuNzItLjEzLjQ2LS4yMS42OC0uMTcuNDMtLjI3LjY0LS4yMS40LS4zMi41OS0uMjUuMzctLjM4LjU1LS4yOC4zNC0uNDQuNWMtLjE2LjE2LS4zMi4zMS0uNDkuNDVzLS4zNS4yNy0uNTQuMzktLjM4LjIzLS41OC4zMy0uNDEuMTktLjYyLjI3LS40NC4xNS0uNjcuMjEtLjQ3LjExLS43MS4xNS0uNDkuMDctLjc1LjA5LS41Mi4wMy0uOC4wM2gtNS42M2MtLjI3LDAtLjU0LS4wMS0uOC0uMDNzLS41MS0uMDUtLjc1LS4wOS0uNDgtLjA5LS43MS0uMTUtLjQ1LS4xMy0uNjctLjIxLS40Mi0uMTctLjYyLS4yNy0uMzktLjIxLS41OC0uMzMtLjM2LS4yNS0uNTQtLjM5LS4zNC0uMjktLjQ5LS40NWMtLjE2LS4xNi0uMy0uMzMtLjQ0LS41cy0uMjctLjM2LS4zOC0uNTUtLjIzLS4zOS0uMzItLjU5LS4xOS0uNDItLjI3LS42NC0uMTUtLjQ1LS4yMS0uNjgtLjExLS40OC0uMTUtLjcyLS4wNy0uNTEtLjA5LS43Ny0uMDMtLjUzLS4wMy0uODF2LTI0Ljc1YzAtLjA1LDAtLjEsMC0uMTRzLjAxLS4wOS4wMi0uMTIuMDItLjA3LjA0LS4xLjAzLS4wNi4wNi0uMDkuMDQtLjA1LjA3LS4wNy4wNi0uMDMuMDktLjA1LjA3LS4wMi4xLS4wMy4wOCwwLC4xMiwwaDEuNDZzLjA5LDAsLjEzLDAsLjA4LjAyLjExLjAzLjA3LjAzLjEuMDUuMDUuMDQuMDguMDcuMDQuMDUuMDYuMDkuMDMuMDcuMDQuMS4wMi4wOC4wMy4xMiwwLC4wOSwwLC4xNHYyNC42NWMwLC4yLDAsLjM5LjAyLjU4cy4wMy4zNy4wNi41NC4wNi4zNS4wOS41MS4wOC4zMi4xMy40OC4xMS4zLjE3LjQ1LjEzLjI4LjIxLjQxLjE2LjI2LjI0LjM4LjE4LjI0LjI4LjM1Yy4xLjExLjIxLjIxLjMyLjMxcy4yMy4xOS4zNS4yNy4yNS4xNi4zOS4yMy4yOC4xMy40Mi4xOS4zLjEuNDYuMTQuMzIuMDguNDkuMS4zNS4wNS41My4wNi4zNy4wMi41Ni4wMmg1LjE4Yy4xOSwwLC4zOCwwLC41Ni0uMDJzLjM2LS4wMy41My0uMDYuMzMtLjA2LjQ5LS4xLjMxLS4wOS40Ni0uMTQuMjktLjExLjQzLS4xOC4yNy0uMTQuMzktLjIyLjI0LS4xNy4zNi0uMjYuMjItLjE5LjMyLS4zYy4xLS4xMS4yLS4yMi4yOS0uMzRzLjE3LS4yNC4yNS0uMzguMTUtLjI3LjIxLS40MS4xMi0uMjkuMTctLjQ1LjEtLjMyLjEzLS40OC4wNy0uMzQuMS0uNTIuMDQtLjM2LjA2LS41NS4wMi0uMzkuMDItLjU5di0yNC42NWMwLS4wNSwwLS4xLDAtLjE0cy4wMS0uMDkuMDMtLjEyLjAzLS4wNy4wNC0uMS4wNC0uMDYuMDYtLjA5LjA1LS4wNS4wOC0uMDcuMDYtLjAzLjEtLjA1LjA3LS4wMi4xMS0uMDMuMDgsMCwuMTMsMFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0yODUuNjcsMTA2LjEzaC0xNS45OWMtLjM0LDAtLjUtLjItLjUtLjYxdi0zMS4zM2MwLS40LjE3LS42MS41LS42MWgxLjQ2Yy4zNywwLC41NS4yLjU1LjYxdjI5LjExYzAsLjMuMTcuNDYuNS40NmgxMy40N2MuNCwwLC42LjE5LjYuNTZ2MS4yN2MwLC4zNy0uMi41Ni0uNi41NloiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWMiIGQ9Ik0yOTEsMTA2LjEzaC0xLjU2Yy0uMzcsMC0uNDktLjItLjM1LS42MWwxMC0zMS4zM2MuMS0uNC4zMy0uNjEuNy0uNjFoMi4zNmMuMzMsMCwuNTcuMi43LjYxbDEwLDMxLjMzYy4xLjQtLjAyLjYxLS4zNS42MWgtMS42MWMtLjM0LDAtLjU1LS4yLS42NS0uNjFsLTIuNzEtOC4xaC0xMy4xN2wtMi43MSw4LjFjLS4xMy40LS4zNS42MS0uNjUuNjFaTTMwMC44Niw3Ni4zNmwtNS43OCwxOC43OGgxMS44MWwtNS44My0xOC43OGgtLjJaIi8+CiAgICA8cGF0aCBmaWxsPSIjMWYzMzFjIiBkPSJNMzIwLjYxLDEwNi4xM2gtMS40NnMtLjA4LDAtLjEyLDAtLjA3LS4wMi0uMS0uMDMtLjA2LS4wMy0uMDktLjA1LS4wNS0uMDQtLjA3LS4wNy0uMDQtLjA1LS4wNS0uMDktLjAzLS4wNy0uMDQtLjEtLjAyLS4wOC0uMDItLjEyLDAtLjA5LDAtLjE0di0zMS4zM2MwLS4wNSwwLS4xLDAtLjE0cy4wMS0uMDkuMDItLjEyLjAyLS4wNy4wNC0uMS4wMy0uMDYuMDUtLjA5LjA0LS4wNS4wNy0uMDcuMDYtLjAzLjA5LS4wNS4wNy0uMDIuMS0uMDMuMDgsMCwuMTIsMGgxMS40NmMuMjcsMCwuNTQuMDEuOC4wM3MuNTEuMDUuNzUuMDkuNDguMDkuNzEuMTUuNDUuMTMuNjcuMjEuNDIuMTcuNjMuMjcuNC4yMS41OC4zMy4zNy4yNS41NC4zOS4zNC4yOS41LjQ1Yy4xNi4xNi4zMS4zMy40NS41cy4yNy4zNi4zOS41NS4yMy4zOS4zMy41OS4xOS40Mi4yNy42NC4xNS40NS4yMS42OC4xMS40OC4xNS43MmMuMDQuMjUuMDcuNTEuMDkuNzdzLjAzLjUzLjAzLjgxdjQuODFjMCwuMjQsMCwuNDctLjAyLjY5cy0uMDQuNDUtLjA3LjY2LS4wNy40Mi0uMTEuNjMtLjEuNC0uMTYuNi0uMTMuMzgtLjIuNTctLjE2LjM2LS4yNS41My0uMTkuMzQtLjI5LjUtLjIyLjMyLS4zNC40N2MtLjEyLjE1LS4yNC4zLS4zNy40M3MtLjI3LjI3LS40MS4zOS0uMjkuMjQtLjQ0LjM1LS4zMS4yMS0uNDcuMzEtLjMzLjE5LS41LjI3LS4zNS4xNi0uNTQuMjMtLjM3LjEzLS41Ny4xOS0uMzkuMS0uNi4xNXYuMmwuNzUsMS41OS43NSwxLjU5Ljc1LDEuNTkuNzUsMS41OS43NSwxLjU5Ljc1LDEuNTkuNzUsMS41OS43NSwxLjU5Yy4wMy4wNS4wNS4xLjA2LjE0cy4wMy4wOS4wMy4xMiwwLC4wNywwLC4xLS4wMS4wNi0uMDMuMDktLjAzLjA1LS4wNi4wNy0uMDUuMDMtLjA5LjA1LS4wNy4wMi0uMTIuMDMtLjA5LDAtLjE1LDBoLTEuNTZjLS4wNSwwLS4xMSwwLS4xNiwwcy0uMS0uMDItLjE0LS4wMy0uMDktLjAzLS4xMy0uMDUtLjA4LS4wNC0uMTItLjA3LS4wNy0uMDUtLjExLS4wOS0uMDYtLjA3LS4wOS0uMS0uMDYtLjA4LS4wOC0uMTItLjA1LS4wOS0uMDctLjE0bC0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OS0uNzQtMS41OWgtNy45NHMtLjA4LDAtLjEyLDAtLjA3LjAxLS4xLjAyLS4wNi4wMi0uMDkuMDQtLjA1LjAzLS4wNy4wNS0uMDQuMDQtLjA1LjA2LS4wMy4wNS0uMDQuMDgtLjAyLjA2LS4wMi4wOSwwLC4wNywwLC4xMXYxMi4zYzAsLjA1LDAsLjEsMCwuMTRzLS4wMS4wOS0uMDMuMTItLjAzLjA3LS4wNC4xLS4wNC4wNi0uMDYuMDktLjA1LjA1LS4wOC4wNy0uMDYuMDMtLjEuMDUtLjA3LjAyLS4xMS4wMy0uMDgsMC0uMTMsMFpNMzIxLjY3LDkwLjU5aDguN2MuMTksMCwuMzgsMCwuNTYtLjAycy4zNi0uMDMuNTMtLjA2LjM0LS4wNi41LS4xLjMxLS4wOS40Ni0uMTQuMjktLjExLjQzLS4xOC4yNy0uMTQuNC0uMjIuMjUtLjE3LjM2LS4yNi4yMy0uMTkuMzMtLjNjLjEtLjExLjItLjIyLjI5LS4zNHMuMTgtLjI0LjI2LS4zNy4xNS0uMjcuMjItLjQxLjEyLS4yOS4xOC0uNDQuMS0uMzEuMTQtLjQ4LjA3LS4zMy4xLS41MS4wNS0uMzYuMDYtLjU0LjAyLS4zOC4wMi0uNTh2LTQuNzZjMC0uMiwwLS4zOS0uMDItLjU4cy0uMDMtLjM3LS4wNi0uNTQtLjA2LS4zNS0uMS0uNTEtLjA5LS4zMi0uMTQtLjQ4LS4xMS0uMy0uMTgtLjQ1LS4xNC0uMjgtLjIyLS40MS0uMTYtLjI2LS4yNi0uMzgtLjE5LS4yNC0uMjktLjM1Yy0uMS0uMTEtLjIxLS4yMS0uMzMtLjMxcy0uMjQtLjE5LS4zNi0uMjctLjI2LS4xNi0uNC0uMjMtLjI4LS4xMy0uNDMtLjE5LS4zLS4xLS40Ni0uMTQtLjMyLS4wOC0uNS0uMS0uMzUtLjA1LS41My0uMDYtLjM3LS4wMi0uNTYtLjAyaC04LjdzLS4wOCwwLS4xMiwwLS4wNy4wMS0uMS4wMi0uMDYuMDItLjA5LjA0LS4wNS4wMy0uMDcuMDUtLjA0LjA0LS4wNS4wNi0uMDMuMDUtLjA0LjA4LS4wMi4wNi0uMDIuMDksMCwuMDcsMCwuMTF2MTMuODJzMCwuMDcsMCwuMTEuMDEuMDYuMDIuMDkuMDIuMDUuMDQuMDguMDMuMDUuMDUuMDYuMDQuMDQuMDcuMDUuMDUuMDMuMDkuMDQuMDcuMDIuMS4wMi4wOCwwLC4xMiwwWiIvPgogIDwvZz4KICA8cG9seWdvbiBmaWxsPSIjMzk1ZjI5IiBwb2ludHM9IjcwLjc5IDAgNi41NSAxMDcuOTUgMTEuMDYgMTA3Ljk1IDc1LjMxIDAgNzAuNzkgMCIvPgogIDxwb2x5Z29uIGZpbGw9IiM2Mzg4NTIiIHBvaW50cz0iNjQuMjQgMCAwIDEwNy45NSAxLjUgMTA3Ljk1IDY1Ljc1IDAgNjQuMjQgMCIvPgogIDxnPgogICAgPHBhdGggZmlsbD0iIzFmMzMxYiIgZD0iTTM3LjkzLDczLjU1bC0yMC4xOSwzMy45M2MtLjA5LjE1LS4xNy4zMS0uMjQuNDhoOS4wOWwyMC40OC0zNC40MWgtOS4xNFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxZjMzMWIiIGQ9Ik01NS4zOCw1OS41OEw4Ni40Nyw3LjM0bDMzLjcsNTIuMThoOS4yN2MtLjA4LS4xOS0uMTctLjM2LS4yOC0uNTNMOTEuMDcsMGgtOS4zN2wtMzUuNDYsNTkuNThoOS4xNFoiLz4KICA8L2c+Cjwvc3ZnPg==';

document.getElementById('sideLogo').src = LOGO_321;

function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  const knob=document.getElementById('themeKnob'); if(knob) knob.textContent = t==='dark' ? '🌙' : '☀️';
  try{ localStorage.setItem('321modular_theme', t); }catch(e){}
}
(function initTheme(){
  const atual = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(atual);
})();
document.getElementById('themeToggle').addEventListener('click', ()=>{
  const atual = document.documentElement.getAttribute('data-theme');
  applyTheme(atual==='dark' ? 'light' : 'dark');
});

const sb = window.SuperAppAuth.getClient();
let SESSION = null;

function showFinanceLoadFailure(message){
  const page = document.createElement('main');
  page.className = 'finance-load-failure';
  const card = document.createElement('section');
  card.className = 'finance-load-failure-card';
  const title = document.createElement('h1');
  title.textContent = 'Gestão Financeira';
  const copy = document.createElement('p');
  copy.textContent = message || 'Não foi possível carregar o ambiente financeiro.';
  const link = document.createElement('a');
  link.href = window.SuperAppAuth.getPortalUrl();
  link.textContent = 'Voltar ao SuperApp';
  card.append(title, copy, link);
  page.append(card);
  document.body.replaceChildren(page);
}
async function loadCentralFinanceSession(){
  const session = await window.SuperAppAuth.getSession();
  if (!session) {
    location.replace(window.SuperAppAuth.getPortalUrl());
    return false;
  }
  const { data, error } = await sb.rpc('load_app_data', {});
  if (error) throw error;
  SESSION = { username: session.user.email, token: 'central-session' };
  if (data && typeof data === 'object') DB = { ...DB, ...data };
  document.getElementById('appRoot').classList.remove('fin-csp-002');
  const profile = await window.SuperAppAuth.getProfile();
  const sessionLabel = profile?.display_name || session.user.email || 'Usuário';

  document.getElementById('side-user-name').textContent = sessionLabel;
  const financeRoleLabel = profile?.role_name || profile?.role_code || 'Acesso operacional';
  const financeScopeLabel = profile?.franchise_name ? `Franquia · ${profile.franchise_name}` : profile?.unit_name ? `Matriz · ${profile.unit_name}` : 'Matriz · acesso global';
  document.getElementById('side-user-role').textContent = `${financeRoleLabel} · ${financeScopeLabel}`;
  startApp();
  return true;
}
async function doLogout(){ location.href = window.SuperAppAuth.getPortalUrl(); }
let DB = {
  obras:[], receber:[], pagar:[],
  config:{ nome:'321 Modular | Minha Loja', resp:'', royalties:5, comissao:3, marketing:0, limitePermuta:0 },
  despesas:{ aluguel:0, salarios:0, encargos:0, contabilidade:0, impostos:0, energia:0, agua:0, internet:0, assinaturas:0, marketing_local:0, outras:0 },
  despesasExtras:[], // despesas fixas cadastradas livremente pelo usuário: [{id, nome, valor}]
  fornecedores:[], // {id, nome, telefone, cnpj, categoria, obs}
  contas:[], // {id, nome, tipo, saldoInicial}
  tiposConta:[{id:'tc_caixa',nome:'Caixa'},{id:'tc_cc',nome:'Conta Corrente'},{id:'tc_poup',nome:'Poupança'}], // editável pelo usuário
  cheques:[], // {id, valor, vencimento, banco, status:'Em carteira'|'Depositado'|'Repassado'|'Devolvido', recId, contaDestinoId, pagarId}
  permutas:[] // {id, valor, descricao, status:'Ativa'|'Usada'|'Baixada', recId, pagarId}
};
const DESP_LBL = { aluguel:'Aluguel do ponto', salarios:'Salários e pró-labore', encargos:'Encargos / FGTS', contabilidade:'Contabilidade', impostos:'Impostos e taxas', energia:'Energia elétrica', agua:'Água', internet:'Internet / Telefonia', assinaturas:'Assinaturas', marketing_local:'Marketing local', outras:'Outras despesas' };
const OBRA_CATS = ['Kit Fábrica','Telhas','Frete','Munck (caminhão)','Alicerce / Blocos','Mão de obra montagem','Material elétrico','Pintura','Alimentação / Estadia','Outros custos de obra'];

// save() grava os dados do usuário logado no Supabase (substitui o antigo localStorage)
let saveInFlight=Promise.resolve();
function save(){
  if(!SESSION) return Promise.resolve(false);
  // Serializa snapshots para uma edicao antiga nunca sobrescrever uma nova.
  const snapshot = JSON.parse(JSON.stringify(DB));
  saveInFlight = saveInFlight.catch(()=>{}).then(async ()=>{
    try{
      const { error } = await sb.rpc('save_app_data', { p_username: SESSION.username, p_token: SESSION.token, p_data: snapshot });
      if(error){ console.error('Erro ao salvar no Supabase:', error); toast('Erro ao salvar: ' + (error.message || 'falha de persistencia'), true); return false; }
      return true;
    }catch(e){ console.error('Erro ao salvar no Supabase:', e); toast('Erro ao salvar: ' + (e.message || 'falha de rede'), true); return false; }
  });
  return saveInFlight;
}
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,5);
// Converte valores para número de forma robusta — aceita tanto o formato
// padrão (1500.50) quanto o formato brasileiro digitado por engano (1.500,50)
const n = v => {
  if(v===null||v===undefined||v==='') return 0;
  let s = String(v).trim();
  s = s.replace(/[^\d,.\-]/g,''); // remove "R$", espaços e qualquer outro símbolo
  if(s.includes(',')){ s = s.replace(/\./g,'').replace(',', '.'); }
  const f = parseFloat(s);
  return isNaN(f) ? 0 : f;
};
const BRL = v => 'R$ '+(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const PCT = v => (v||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
const fmtDate = s => s ? s.split('-').reverse().join('/') : '—';
const addMonths = (dateStr, m) => { const d=new Date(dateStr+'T00:00:00'); d.setMonth(d.getMonth()+m); return d.toISOString().slice(0,10); };
const escapeHtml = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const escapeAttr = s => escapeHtml(s);

// ═══════════════════════════════════════════════════
// TABELAS COM BUSCA, FILTRO POR COLUNA E ORDENAÇÃO (igual ao index.html)
// ═══════════════════════════════════════════════════
const tableStates = {}; // tableKey -> { sortKey, sortDir, filtros:{colKey:Set}, busca }
function getTableState(tableKey){
  if(!tableStates[tableKey]) tableStates[tableKey] = { sortKey:null, sortDir:1, filtros:{}, busca:'' };
  return tableStates[tableKey];
}
// Desenha a barra de busca + "limpar filtros" acima da tabela.
function montarBarraTabela(tableKey, containerId, onChange){
  const el = document.getElementById(containerId);
  if(!el) return;
  const st = getTableState(tableKey);
  el.innerHTML = `<div class="toolbar">
      <input type="text" class="tbl-busca" placeholder="🔍 Buscar em tudo..." value="${escapeAttr(st.busca)}">
      <button type="button" class="btn bs bsm tbl-limpar" type="button">Limpar filtros e ordenação</button>
    </div>`;
  el.querySelector('.tbl-busca').addEventListener('input', e=>{ st.busca = e.target.value.toLowerCase(); onChange(); });
  el.querySelector('.tbl-limpar').addEventListener('click', ()=>{
    tableStates[tableKey] = { sortKey:null, sortDir:1, filtros:{}, busca:'' };
    onChange();
  });
}
// Gera o <thead> com botões de ordenar/filtrar. colunas: [{key,label,filterable?:false}]
function montarCabecalhoOrdenavel(tableKey, colunas, extraTh){
  const st = getTableState(tableKey);
  return '<tr>' + colunas.map(c=>{
    if(c.noSort) return `<th>${c.label}</th>`;
    const seta = st.sortKey===c.key ? (st.sortDir===1?' ▲':' ▼') : '';
    return `<th><div class="th-inner">
      <button type="button" class="th-sort" data-tk="${tableKey}" data-key="${c.key}">${c.label}<span class="sort-arrow">${seta}</span></button>
      ${c.filterable!==false?`<button type="button" class="th-filtro${st.filtros[c.key]?' ativo':''}" data-tk="${tableKey}" data-key="${c.key}" title="Filtrar esta coluna">▾</button>`:''}
    </div></th>`;
  }).join('') + (extraTh||'') + '</tr>';
}
// Aplica busca + filtros de coluna + ordenação sobre a lista de linhas.
function aplicarFiltroOrdenacao(tableKey, colunas, linhas, valorDe){
  const st = getTableState(tableKey);
  let rows = linhas.slice();
  if(st.busca){ rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(st.busca)); }
  Object.entries(st.filtros).forEach(([key, set])=>{
    const col = colunas.find(c=>c.key===key); if(!col) return;
    rows = rows.filter(r => set.has(String(valorDe(r,col))));
  });
  if(st.sortKey){
    const col = colunas.find(c=>c.key===st.sortKey);
    rows.sort((a,b)=>{
      let va=valorDe(a,col), vb=valorDe(b,col);
      if(typeof va==='string') va=va.toLowerCase();
      if(typeof vb==='string') vb=vb.toLowerCase();
      if(va<vb) return -1*st.sortDir;
      if(va>vb) return 1*st.sortDir;
      return 0;
    });
  }
  return rows;
}
// Liga os cliques de ordenar/filtrar do cabeçalho gerado por montarCabecalhoOrdenavel.
function ligarEventosCabecalho(tableKey, colunas, linhasTodas, valorDe, onChange){
  document.querySelectorAll(`.th-sort[data-tk="${tableKey}"]`).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const st=getTableState(tableKey), key=btn.dataset.key;
      if(st.sortKey===key) st.sortDir*=-1; else { st.sortKey=key; st.sortDir=1; }
      onChange();
    });
  });
  document.querySelectorAll(`.th-filtro[data-tk="${tableKey}"]`).forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const key=btn.dataset.key, col=colunas.find(c=>c.key===key);
      const valores=[...new Set(linhasTodas.map(r=>String(valorDe(r,col))))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      const st=getTableState(tableKey);
      const atuais = st.filtros[key] || new Set(valores);
      abrirFlutuante(btn, 'dd-panel-float', (painel)=>{
        painel.innerHTML = `<div data-csp-style="padding:4px 8px 8px;font-size:10.5px;font-weight:700;color:var(--tm);text-transform:uppercase;letter-spacing:.05em">Filtrar ${col.label}</div>` +
          valores.map(v=>`<label class="dd-opt"><input type="checkbox" class="flt-cb" value="${escapeAttr(v)}" ${atuais.has(v)?'checked':''} data-csp-style="margin-right:2px">${escapeHtml(v||'—')}</label>`).join('') +
          `<div data-csp-style="display:flex;gap:10px;padding:8px 8px 2px;border-top:1px solid var(--bdr);margin-top:6px">
             <button type="button" class="link-btn" data-a="all">Marcar todos</button>
             <button type="button" class="link-btn" data-a="none">Desmarcar todos</button>
           </div>`;
        function atualizar(){
          const marcados=[...painel.querySelectorAll('.flt-cb:checked')].map(x=>x.value);
          if(marcados.length===valores.length) delete st.filtros[key]; else st.filtros[key]=new Set(marcados);
          onChange();
        }
        painel.querySelectorAll('.flt-cb').forEach(cb=>cb.addEventListener('change', atualizar));
        painel.querySelector('[data-a="all"]').addEventListener('click', ()=>{ painel.querySelectorAll('.flt-cb').forEach(cb=>cb.checked=true); delete st.filtros[key]; onChange(); });
        painel.querySelector('[data-a="none"]').addEventListener('click', ()=>{ painel.querySelectorAll('.flt-cb').forEach(cb=>cb.checked=false); st.filtros[key]=new Set(); onChange(); });
      });
    });
  });
}

// ═══════════════════════════════════════════════════
// SELETOR CUSTOMIZADO — substitui o <select> nativo pela mesma estética/
// painel flutuante do resto do app, sem quebrar o código existente: o
// <select> original continua no DOM (escondido) e recebe o valor normalmente,
// então tudo que lê `.value` ou escuta `onchange` continua funcionando.
// ═══════════════════════════════════════════════════
let __selEnhSeq=0;
function enhanceSelect(select){
  if(!select || select.dataset.enhanced) return;
  select.dataset.enhanced='1';
  const id='selEnh_'+(++__selEnhSeq);
  const btn=document.createElement('button');
  btn.type='button'; btn.className='sel-simple-btn'; btn.id=id;
  select.style.display='none';
  select.insertAdjacentElement('afterend', btn);
  // Código do app às vezes esconde/mostra o <select> diretamente via
  // `.style.display = 'none'/'block'/...` (ex.: populateCustosFiltro). Como o
  // <select> nativo já está permanentemente oculto (substituído visualmente
  // pelo botão), isso fazia o select nativo REAPARECER sem estilo ao lado do
  // botão. Interceptando "display" no style desta instância, qualquer
  // show/hide passa a controlar o botão em vez do select escondido.
  Object.defineProperty(select.style, 'display', {
    get(){ return btn.style.display==='none' ? 'none' : ''; },
    set(v){ btn.style.display = (v==='none') ? 'none' : ''; },
    configurable:true
  });
  function rotulo(){
    const opt=select.options[select.selectedIndex];
    return opt ? opt.textContent : '—';
  }
  function atualizarBtn(){ btn.textContent=rotulo(); }
  atualizarBtn();
  btn.addEventListener('click', e=>{
    e.stopPropagation();
    btn.classList.add('dd-active');
    abrirFlutuante(btn, 'dd-panel-float', (painel, fechar)=>{
      painel.innerHTML=[...select.options].map((o,i)=>
        `<div class="dd-opt${i===select.selectedIndex?' dd-opt-sel':''}" data-i="${i}">${escapeAttr(o.textContent)}</div>`
      ).join('');
      painel.querySelectorAll('.dd-opt').forEach(opt=>{
        opt.addEventListener('click', ()=>{
          select.selectedIndex=+opt.dataset.i;
          atualizarBtn();
          fechar();
          select.dispatchEvent(new Event('change', {bubbles:true}));
        });
      });
    });
  });
  // O resto do app troca o valor via `select.value = ...` em várias funções
  // (fillObraForm, editRec, editPag, clearObraForm, etc.) — interceptando o
  // setter da propriedade "value" nesta instância, o rótulo do botão
  // acompanha automaticamente sem precisar tocar em cada uma dessas funções.
  const nativeValueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  Object.defineProperty(select, 'value', {
    get(){ return nativeValueDesc.get.call(select); },
    set(v){ nativeValueDesc.set.call(select, v); atualizarBtn(); },
    configurable:true
  });
  select.addEventListener('change', atualizarBtn);
  select.__syncSelBtn = atualizarBtn;
  select.__enhBtn = btn;
}
function enhanceAllSelects(scope){
  (scope||document).querySelectorAll('select').forEach(enhanceSelect);
}
document.addEventListener('click', e=>{
  document.querySelectorAll('.sel-simple-btn.dd-active').forEach(b=>{ if(b!==e.target) b.classList.remove('dd-active'); });
});

// ═══════════════════════════════════════════════════
// MÁSCARA DE VALOR MONETÁRIO — todo campo de valor sempre mostra "R$ X.XXX,XX"
// enquanto a pessoa digita, e também quando o próprio app preenche o campo
// via JS (fillObraForm, editRec, editPag, etc.) — sem precisar alterar cada
// um desses pontos: interceptamos o setter nativo de "value" desta instância.
// ═══════════════════════════════════════════════════
function attachMoneyMask(input){
  if(!input || input.dataset.moneyMasked) return;
  input.dataset.moneyMasked='1';
  input.type='text';
  input.setAttribute('inputmode','decimal');
  input.setAttribute('autocomplete','off');
  const nativeDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
  const setRaw = v => nativeDesc.set.call(input, v);
  const getRaw = () => nativeDesc.get.call(input);
  input.addEventListener('input', ()=>{
    const digits = getRaw().replace(/\D/g,'').replace(/^0+(?=\d)/,'');
    if(!digits){ setRaw(''); return; }
    const val = parseInt(digits,10)/100;
    setRaw('R$ '+val.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}));
  });
  Object.defineProperty(input, 'value', {
    get(){ return getRaw(); },
    set(v){
      if(v===''||v===null||v===undefined){ setRaw(''); return; }
      const num = typeof v==='number' ? v : n(v);
      setRaw(num ? 'R$ '+num.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}) : '');
    },
    configurable:true
  });
}
function attachMoneyMasks(ids){ ids.forEach(id=>{ const el=document.getElementById(id); if(el) attachMoneyMask(el); }); }


// ═══════════════════════════════════════════════════
// CALENDÁRIO CUSTOMIZADO — substitui o <input type="date"> nativo
// (cujo popup é controlado pelo navegador/SO e não dá pra estilizar)
// ═══════════════════════════════════════════════════
let __floatEl=null, __floatCleanup=null, __floatActiveBtn=null;
function fecharFlutuante(){
  if(__floatCleanup){ __floatCleanup(); __floatCleanup=null; }
  if(__floatEl){ __floatEl.remove(); __floatEl=null; }
  if(__floatActiveBtn){ __floatActiveBtn.classList.remove('dd-active'); __floatActiveBtn=null; }
}
function abrirFlutuante(trigger, classe, montar){
  const jaEraEsse = __floatEl && __floatEl.dataset.trigger === trigger.__floatId;
  fecharFlutuante();
  if(jaEraEsse) return; // clicar de novo no mesmo botão só fecha
  if(!trigger.__floatId) trigger.__floatId = 'trg_'+Math.random().toString(36).slice(2);
  const el = document.createElement('div');
  el.className = classe;
  el.dataset.trigger = trigger.__floatId;
  document.body.appendChild(el);
  __floatEl = el;
  function posicionar(){
    const r = trigger.getBoundingClientRect();
    const ph = el.offsetHeight, pw = el.offsetWidth;
    let top = r.bottom + 5;
    if(top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 5);
    let left = r.left;
    if(left + pw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - pw - 8);
    el.style.top = top+'px'; el.style.left = left+'px';
  }
  montar(el, fecharFlutuante);
  posicionar();
  const onScroll = (e)=>{ if(el.contains(e.target)) return; fecharFlutuante(); };
  const onResize = ()=>posicionar();
  const onDocClick = (e)=>{ if(!el.contains(e.target) && e.target!==trigger && !trigger.contains(e.target)) fecharFlutuante(); };
  document.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);
  setTimeout(()=>document.addEventListener('click', onDocClick), 0);
  __floatCleanup = ()=>{
    document.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('click', onDocClick);
  };
}

function syncDateButton(inputId){
  const input = document.getElementById(inputId);
  const btn = document.querySelector(`.cell-date[data-target="${inputId}"]`);
  if(!input || !btn) return;
  if(input.value){ btn.textContent = fmtDate(input.value); btn.classList.remove('placeholder'); }
  else{ btn.textContent = 'Selecionar…'; btn.classList.add('placeholder'); }
}
function syncAllDateButtons(){
  document.querySelectorAll('.cell-date[data-target]').forEach(btn=>syncDateButton(btn.dataset.target));
}

function initCalendarios(){
  document.querySelectorAll('.cell-date[data-target]').forEach(btn=>{
    const inputId = btn.dataset.target;
    const input = document.getElementById(inputId);
    if(!input) return;
    syncDateButton(inputId);
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      btn.classList.add('dd-active');
      __floatActiveBtn = btn;
      let selecionado = input.value || null;
      const base = selecionado ? selecionado.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth()+1];
      let ano = base[0], mes = base[1];
      abrirFlutuante(btn, 'cal-dd', (painelEl, fechar)=>{
        function montarPainel(){
          const primeiroDia = new Date(ano, mes-1, 1);
          const nomeMes = primeiroDia.toLocaleDateString('pt-BR', { month:'long', year:'numeric' });
          const diaSemanaInicio = primeiroDia.getDay();
          const totalDias = new Date(ano, mes, 0).getDate();
          const totalDiasMesAnterior = new Date(ano, mes-1, 0).getDate();
          const hojeISO = new Date().toISOString().slice(0,10);
          let celulas = '';
          for(let i=0;i<diaSemanaInicio;i++){
            celulas += `<div class="cal-day cal-muted">${totalDiasMesAnterior - diaSemanaInicio + 1 + i}</div>`;
          }
          for(let d=1; d<=totalDias; d++){
            const iso = `${ano}-${String(mes).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const cls = ['cal-day'];
            if(iso===hojeISO) cls.push('cal-today');
            if(iso===selecionado) cls.push('cal-selected');
            celulas += `<div class="${cls.join(' ')}" data-iso="${iso}">${d}</div>`;
          }
          const restante = (7 - ((diaSemanaInicio+totalDias)%7))%7;
          for(let d=1; d<=restante; d++){ celulas += `<div class="cal-day cal-muted">${d}</div>`; }
          painelEl.innerHTML = `
            <div class="cal-head">
              <button type="button" data-nav="-1">‹</button>
              <div class="cal-title">${nomeMes}</div>
              <button type="button" data-nav="1">›</button>
            </div>
            <div class="cal-grid">
              ${['D','S','T','Q','Q','S','S'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}
              ${celulas}
            </div>
            <div class="cal-foot">
              <button type="button" data-acao="hoje">Hoje</button>
              <button type="button" data-acao="limpar">Limpar</button>
            </div>`;
          painelEl.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click', (ev)=>{
            ev.stopPropagation();
            mes += parseInt(b.dataset.nav); if(mes<1){mes=12;ano--;} if(mes>12){mes=1;ano++;}
            montarPainel();
          }));
          painelEl.querySelectorAll('.cal-day[data-iso]').forEach(c=>c.addEventListener('click', ()=>{
            selecionado = c.dataset.iso;
            input.value = selecionado;
            syncDateButton(inputId);
            fechar();
          }));
          painelEl.querySelector('[data-acao="hoje"]').addEventListener('click', (ev)=>{
            ev.stopPropagation();
            selecionado = new Date().toISOString().slice(0,10);
            input.value = selecionado;
            syncDateButton(inputId);
            fechar();
          });
          painelEl.querySelector('[data-acao="limpar"]').addEventListener('click', (ev)=>{
            ev.stopPropagation();
            selecionado = null;
            input.value = '';
            syncDateButton(inputId);
            fechar();
          });
        }
        montarPainel();
      });
    });
  });
}


// ── CALC ──
// Resultado de uma obra = venda − custos lançados em A Pagar vinculados à obra
// (royalties e comissão de vendas entram aqui como lançamentos reais em "A
// Pagar" — gerados automaticamente ao cadastrar a obra — em vez de serem
// descontados "por fora" sem aparecer em lugar nenhum).
function calcObra(o) {
  const venda = n(o.venda);
  const pagarObra = DB.pagar.filter(p => p.obraId === o.id && isObraCat(p.cat));
  const custos = pagarObra.reduce((s,p) => s+n(p.valor), 0);
  const comissao = pagarObra.filter(p=>p.cat==='Comissão').reduce((s,p)=>s+n(p.valor),0);
  const resultado = venda - custos;
  const margem = venda > 0 ? (resultado/venda)*100 : 0;
  return { venda, custos, comissao, resultado, margem };
}

function isObraCat(cat) {
  return ['Kit Fábrica','Telhas','Frete','Munck (caminhão)','Alicerce / Blocos',
    'Mão de obra montagem','Material elétrico','Pintura','Alimentação / Estadia',
    'Outros custos de obra','Royalties','Comissão'].includes(cat);
}

// Mantém um único lançamento de "Comissão" em A Pagar sempre vinculado a esta
// obra e sincronizado com o valor de venda atual. Retorna uma linha de resumo
// (para o aviso de obra salva) ou null se nada relevante aconteceu.
function syncComissaoObra(o, isNew){
  const comissaoPct = n(DB.config.comissao);
  const novoValor = comissaoPct>0 ? +(n(o.venda)*comissaoPct/100).toFixed(2) : 0;
  const desc = `Comissão de vendas (${comissaoPct}%) — ${o.cliente}`;
  let entry = DB.pagar.find(p=>p.obraId===o.id && p.cat==='Comissão');

  if(!entry){
    if(novoValor<=0) return null;
    DB.pagar.push({ id:uid(), cat:'Comissão', desc, obraId:o.id,
      venc:o.dtC||new Date().toISOString().slice(0,10), valor:novoValor, pago:0, status:'Pendente', nf:'' });
    return isNew ? `Comissão de vendas: ${BRL(novoValor)} (lançada em "A Pagar")` : null;
  }

  entry.desc = desc;
  if(Math.abs(n(entry.valor) - novoValor) < 0.005) return null; // sem mudança real de valor

  const valorAnterior = n(entry.valor);
  const jaPago = n(entry.pago) > 0;
  entry.valor = novoValor;
  if(jaPago){
    // O valor pago nunca é mexido/perdido — só o status volta para "Pendente"
    // para ficar fácil de localizar e conferir a diferença.
    entry.status = 'Pendente';
  }
  return `Comissão de vendas atualizada: ${BRL(valorAnterior)} → ${BRL(novoValor)}${jaPago?' (voltou para "Pendente" para conferência — o valor já pago foi mantido)':''}`;
}

function totalDesp() {
  const fixas = Object.values(DB.despesas).reduce((s,v)=>s+n(v),0);
  const extras = (DB.despesasExtras||[]).reduce((s,x)=>s+n(x.valor),0);
  return fixas + extras;
}

// ── Detecta automaticamente contas vencidas ──
// Antes, "Em atraso"/"Vencido" só existia se alguém marcasse manualmente.
// Agora, qualquer lançamento "Pendente" cuja data de vencimento já passou e
// que ainda não foi totalmente recebido/pago passa a contar como atrasado
// automaticamente — e volta para "Pendente" sozinho se a data for adiada.
function sincronizarVencidos(){
  const hoje = new Date().toISOString().slice(0,10);
  let mudou=false;
  DB.receber.forEach(r=>{
    if(r.status==='Recebido') return;
    const atrasado = !!r.venc && r.venc < hoje && n(r.rec) < n(r.prev);
    const novo = atrasado ? 'Em atraso' : 'Pendente';
    if(r.status !== novo){ r.status = novo; mudou=true; }
  });
  DB.pagar.forEach(p=>{
    if(p.status==='Pago') return;
    const vencido = !!p.venc && p.venc < hoje && n(p.pago) < n(p.valor);
    const novo = vencido ? 'Vencido' : 'Pendente';
    if(p.status !== novo){ p.status = novo; mudou=true; }
  });
  if(mudou) save();
}

function getMeses() {
  const ms = new Set();
  DB.obras.forEach(o=>{ if(o.dtC) ms.add(o.dtC.slice(0,7)); });
  DB.receber.forEach(r=>{ if(r.venc) ms.add(r.venc.slice(0,7)); });
  DB.pagar.forEach(p=>{ if(p.venc) ms.add(p.venc.slice(0,7)); });
  return [...ms].sort();
}
const fmtMes = ym => { const[y,m]=ym.split('-'); return ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][+m-1]+'/'+y.slice(2); };

// ── STATUS BADGE ──
function sbadge(s){
  const m={
    'Em negociação':'b-gray','Contrato assinado':'b-purple','Em produção':'b-blue',
    'Em montagem':'b-yellow','Entregue':'b-green','Cancelado':'b-red'
  };
  return `<span class="badge ${m[s]||'b-gray'}">${escapeHtml(s)}</span>`;
}
function pbadge(s){
  return `<span class="badge ${{Recebido:'b-green',Pago:'b-green',Pendente:'b-purple',Vencido:'b-red','Em atraso':'b-red'}[s]||'b-gray'}">${escapeHtml(s)}</span>`;
}

// ── STATUS EDITÁVEL DIRETO NA LINHA — "A Receber" ──
const REC_STATUS_CLASS = { 'Pendente':'b-purple', 'Recebido':'b-green', 'Em atraso':'b-red' };
const REC_STATUS_DOT = { 'Pendente':'#A855F7', 'Recebido':'#10B981', 'Em atraso':'#EF4444' };
function recStatusPickHtml(r){
  const cls = REC_STATUS_CLASS[r.status] || 'b-gray';
  return `<button type="button" class="status-pick badge ${cls}" data-rid="${escapeAttr(r.id)}">${escapeHtml(r.status)}</button>`;
}
function ligarStatusPickersRec(){
  document.querySelectorAll('.status-pick[data-rid]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const rid=btn.dataset.rid;
      const r=DB.receber.find(x=>x.id===rid);
      if(!r) return;
      abrirFlutuante(btn, 'dd-panel-float', (painel, fechar)=>{
        const opcoes=['Pendente','Recebido','Em atraso'];
        painel.innerHTML = opcoes.map(s=>
          `<div class="dd-opt${s===r.status?' dd-opt-sel':''}" data-s="${s}"><span class="dd-dot" data-csp-style="background:${REC_STATUS_DOT[s]}"></span>${s}</div>`
        ).join('');
        painel.querySelectorAll('.dd-opt').forEach(opt=>{
          opt.addEventListener('click', ()=>{
            fechar();
            const novo=opt.dataset.s;
            if(novo===r.status) return;
            r.status=novo;
            // O valor recebido sempre acompanha o status escolhido aqui: marcar
            // como "Recebido" preenche o valor total; voltar para "Pendente" ou
            // "Em atraso" zera o valor recebido. Sem isso, os totais (Recebido,
            // Faturamento, etc.) não mudavam ao reverter o status.
            r.rec = novo==='Recebido' ? n(r.prev) : 0;
            save();
            renderRec(); renderDash(); badges();
            toast('Status atualizado para "'+novo+'".');
          });
        });
      });
    });
  });
}

// ═══════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════
const navLinks = document.querySelectorAll('nav a');
const PAGE_TITLES = {
  dash:['Dashboard','Visão consolidada — atualiza automaticamente'],
  obras:['Obras','Cada obra é um negócio — acompanhe receita, custos e resultado individualmente'],
  receber:['A Receber','Gerado automaticamente ao cadastrar obras — atualize o status quando receber'],
  pagar:['A Pagar','Lance custos de obras e despesas operacionais'],
  fornecedores:['Fornecedores','Cadastro de fornecedores para uso em A Pagar'],
  contas:['Contas','Contas de caixa e bancos usadas nos recebimentos e pagamentos'],
  fluxocaixa:['Fluxo de Caixa','Movimentação do período, posição atual e limite de permuta'],
  dre:['DRE — Resultado','Resultado consolidado da loja ou de uma obra específica'],
  despesas:['Despesas Fixas Mensais','Custo recorrente da loja — alimenta automaticamente o DRE'],
  config:['Configurações','Dados da loja e parâmetros financeiros'],
};
function abrirMenuMobile(){
  document.getElementById('sidebar').classList.add('nav-open');
  document.getElementById('navBackdrop').classList.add('active');
}
function fecharMenuMobile(){
  document.getElementById('sidebar').classList.remove('nav-open');
  document.getElementById('navBackdrop').classList.remove('active');
}
function show(id, el){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  navLinks.forEach(a=>a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(el && el.classList) el.classList.add('active');
  fecharMenuMobile();
  const t=PAGE_TITLES[id];
  if(t){ document.getElementById('pageTitle').textContent=t[0]; document.getElementById('pageSub').textContent=t[1]; }
  const r={dash:renderDash,obras:renderObras,receber:renderRec,pagar:renderPag,fornecedores:renderFornecedores,contas:renderContas,fluxocaixa:renderFluxoCaixaSection,dre:renderDRESection,despesas:renderDesp,config:renderConfig};
  if(r[id]) r[id]();
  window.scrollTo(0,0);
}

// ═══════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════
if(window.Chart){ Chart.defaults.font.family = "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"; }
let charts={};
function killChart(id){ if(charts[id]){ charts[id].destroy(); delete charts[id]; } }

function renderDash(){
  sincronizarVencidos();
  // Period selector
  const sel=document.getElementById('dashPer');
  const cur=sel.value;
  sel.innerHTML='<option value="all">Todos os períodos</option>';
  getMeses().forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=fmtMes(m); if(m===cur)o.selected=true; sel.appendChild(o); });
  if(sel.__syncSelBtn) sel.__syncSelBtn();
  const mes=sel.value;

  // ── Cálculo em regime de caixa: soma o que já foi de fato recebido/pago,
  // não o valor "cheio" da venda/lançamento. Isso garante que o dashboard
  // sempre bate com o status real de "A Receber" e "A Pagar". Royalties e
  // comissão de vendas entram dentro de custosObraPagos, pois já são
  // lançamentos reais em "A Pagar" (vinculados à obra) — não são mais
  // descontados "por fora" sem aparecer em nenhum menu.
  const noPeriodo = (venc) => mes==='all' || (venc||'').startsWith(mes);
  const fat = DB.receber.filter(r=>noPeriodo(r.venc)).reduce((s,r)=>s+n(r.rec),0);
  const custosObraPagos = DB.pagar.filter(p=>isObraCat(p.cat)&&noPeriodo(p.venc)).reduce((s,p)=>s+n(p.pago),0);
  const despOpPagas = DB.pagar.filter(p=>!isObraCat(p.cat)&&noPeriodo(p.venc)).reduce((s,p)=>s+n(p.pago),0);
  const mgBruta = fat - custosObraPagos;
  const despMult = mes==='all' ? Math.max(getMeses().length,1) : 1;
  const despFixed = totalDesp() * despMult;
  const resultado = mgBruta - despFixed - despOpPagas;

  const obrasEntregues = mes==='all'
    ? DB.obras.filter(o=>o.status==='Entregue')
    : DB.obras.filter(o=>o.status==='Entregue'&&o.dtE&&o.dtE.startsWith(mes));

  const totRec = DB.receber.filter(r=>r.status!=='Recebido').reduce((s,r)=>s+(n(r.prev)-n(r.rec)),0);
  const emAtraso = DB.receber.filter(r=>r.status==='Em atraso').reduce((s,r)=>s+(n(r.prev)-n(r.rec)),0);
  const totPag = DB.pagar.filter(p=>p.status!=='Pago').reduce((s,p)=>s+(n(p.valor)-n(p.pago)),0);

  // KPIs
  document.getElementById('kpiDash').innerHTML=`
    <div class="kpi"><div class="kpi-lbl">Faturamento</div><div class="kpi-val">${BRL(fat)}</div><div class="kpi-sub">Total recebido no período · ${obrasEntregues.length} obra${obrasEntregues.length!==1?'s':''} entregue${obrasEntregues.length!==1?'s':''}</div></div>
    <div class="kpi orange"><div class="kpi-lbl">Margem bruta</div><div class="kpi-val">${BRL(mgBruta)}</div><div class="kpi-sub">${fat>0?PCT(mgBruta/fat*100):'—'} sobre o recebido</div></div>
    <div class="kpi ${resultado>=0?'green':'red'}"><div class="kpi-lbl">Resultado líquido</div><div class="kpi-val ${resultado>=0?'pos':'neg'}">${BRL(resultado)}</div><div class="kpi-sub">${fat>0?PCT(resultado/fat*100):'—'} sobre o recebido</div></div>
    <div class="kpi gold"><div class="kpi-lbl">A receber</div><div class="kpi-val">${BRL(totRec)}</div><div class="kpi-sub">Recebimentos pendentes</div></div>
    <div class="kpi ${emAtraso>0?'red':''}"><div class="kpi-lbl">Em atraso</div><div class="kpi-val ${emAtraso>0?'neg':''}">${BRL(emAtraso)}</div><div class="kpi-sub">Recebimentos vencidos</div></div>
    <div class="kpi blue"><div class="kpi-lbl">A pagar</div><div class="kpi-val">${BRL(totPag)}</div><div class="kpi-sub">Pagamentos pendentes</div></div>
  `;

  // Alertas
  const al=document.getElementById('dashAlerts');
  al.innerHTML='';
  if(emAtraso>0) al.innerHTML+=`<div class="box bx-red"><div class="box-icon">🔴</div><div><strong>Atenção:</strong> ${BRL(emAtraso)} em recebimentos em atraso.</div></div>`;
  if(resultado<0) al.innerHTML+=`<div class="box bx-red"><div class="box-icon">📉</div><div><strong>Resultado negativo:</strong> as despesas e custos pagos superam o valor recebido no período.</div></div>`;

  // Charts — cada um isolado: um erro em um gráfico não pode mais travar os outros
  try{ populateCustosFiltro(); }catch(e){ console.error('Erro ao popular filtro de custos:', e); }
  [renderChartMensal, renderChartMargem, renderChartCustos, renderChartStatus].forEach(fn=>{
    try{ fn(); }catch(e){ console.error('Erro ao renderizar gráfico ('+fn.name+'):', e); }
  });

  // Tabela obras recentes
  const rec=[...DB.obras].sort((a,b)=>(b.dtC||'')>(a.dtC||'')?1:-1).slice(0,6);
  document.getElementById('dashObras').innerHTML = rec.length===0
    ? '<tr><td colspan="7" class="tc" data-csp-style="padding:20px;color:var(--tm)">Nenhuma obra cadastrada</td></tr>'
    : rec.map(o=>{
        const c=calcObra(o);
        return `<tr>
          <td><strong>${escapeHtml(o.cliente)}</strong><div class="tdim">${escapeHtml(o.cidade||'')}</div></td>
          <td>${escapeHtml(o.modelo)}</td>
          <td>${sbadge(o.status)}</td>
          <td class="tr mono">${BRL(n(o.venda))}</td>
          <td class="tr mono">${BRL(c.custos)}</td>
          <td class="tr mono ${c.resultado>=0?'pos':'neg'}">${o.status==='Entregue'?BRL(c.resultado):'—'}</td>
          <td class="tr ${c.margem>=35?'pos':c.margem>=20?'':'neg'}">${o.status==='Entregue'?PCT(c.margem):'—'}</td>
        </tr>`;
      }).join('');

  badges();
}

function renderChartMensal(){
  killChart('cMensal');
  const meses=getMeses().slice(-6);
  const empty=document.getElementById('cMensalEmpty');
  if(!meses.length){ empty.style.display='flex'; return; }
  empty.style.display='none';
  const fat=meses.map(m=>DB.receber.filter(r=>(r.venc||'').startsWith(m)).reduce((s,r)=>s+n(r.rec),0));
  const res=meses.map((m,i)=>{
    const custosObra=DB.pagar.filter(p=>isObraCat(p.cat)&&(p.venc||'').startsWith(m)).reduce((s,p)=>s+n(p.pago),0);
    const despOp=DB.pagar.filter(p=>!isObraCat(p.cat)&&(p.venc||'').startsWith(m)).reduce((s,p)=>s+n(p.pago),0);
    return fat[i]-custosObra-despOp-totalDesp();
  });
  const ctx=document.getElementById('cMensal').getContext('2d');
  charts.cMensal=new Chart(ctx,{type:'bar',data:{labels:meses.map(fmtMes),datasets:[
    {label:'Faturamento',data:fat,backgroundColor:'#638854bb',borderRadius:4},
    {label:'Resultado',data:res,backgroundColor:res.map(v=>v>=0?'#2A5EA9bb':'#C0392Bbb'),borderRadius:4}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:11}}}},scales:{y:{ticks:{callback:v=>'R$'+v.toLocaleString('pt-BR',{notation:'compact'}),font:{size:10}}}}}});
}

function renderChartMargem(){
  killChart('cMargem');
  const obras=DB.obras.filter(o=>o.status==='Entregue').slice(-8);
  const empty=document.getElementById('cMargemEmpty');
  if(!obras.length){ empty.style.display='flex'; return; }
  empty.style.display='none';
  const ctx=document.getElementById('cMargem').getContext('2d');
  const margens=obras.map(o=>+calcObra(o).margem.toFixed(1));
  charts.cMargem=new Chart(ctx,{type:'bar',data:{labels:obras.map(o=>o.cliente.split(' ')[0]),datasets:[{label:'Margem %',data:margens,backgroundColor:margens.map(m=>m>=40?'#2A5EA9cc':m>=30?'#638854cc':m>=20?'#F9B218cc':'#EE6B1Bcc'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:60,ticks:{callback:v=>v+'%',font:{size:10}}}}}});
}

function populateCustosFiltro(){
  const modo=document.getElementById('custosModo').value;
  const sel=document.getElementById('custosFiltro');
  const cur=sel.value;
  if(modo==='all'){ sel.style.display='none'; sel.innerHTML=''; return; }
  sel.style.display='';
  if(modo==='obra'){
    sel.innerHTML = DB.obras.length
      ? DB.obras.slice().sort((a,b)=>(b.dtC||'')>(a.dtC||'')?1:-1).map(o=>`<option value="${escapeAttr(o.id)}">${escapeHtml(o.cliente)} — ${escapeHtml(o.modelo)}</option>`).join('')
      : '<option value="">Nenhuma obra cadastrada</option>';
  } else if(modo==='mes'){
    const meses=getMeses();
    sel.innerHTML = meses.length ? meses.slice().reverse().map(m=>`<option value="${m}">${fmtMes(m)}</option>`).join('') : '<option value="">Sem dados</option>';
  } else if(modo==='ano'){
    const anos=[...new Set(getMeses().map(m=>m.slice(0,4)))].sort().reverse();
    sel.innerHTML = anos.length ? anos.map(a=>`<option value="${a}">${a}</option>`).join('') : '<option value="">Sem dados</option>';
  }
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
  if(sel.__syncSelBtn) sel.__syncSelBtn();
}
function onCustosModoChange(){ populateCustosFiltro(); renderChartCustos(); }
function renderChartCustos(){
  killChart('cCustos');
  const modo=document.getElementById('custosModo').value;
  const filtro=document.getElementById('custosFiltro').value;
  let pagos = DB.pagar.filter(p=>p.obraId&&isObraCat(p.cat));
  if(modo==='obra' && filtro) pagos = pagos.filter(p=>p.obraId===filtro);
  else if(modo==='mes' && filtro) pagos = pagos.filter(p=>(p.venc||'').startsWith(filtro));
  else if(modo==='ano' && filtro) pagos = pagos.filter(p=>(p.venc||'').startsWith(filtro));
  const cats={};
  pagos.forEach(p=>{ cats[p.cat]=(cats[p.cat]||0)+n(p.valor); });
  const labels=Object.keys(cats).filter(k=>cats[k]>0);
  const empty=document.getElementById('cCustosEmpty');
  if(!labels.length){ empty.style.display='flex'; return; }
  empty.style.display='none';
  const ctx=document.getElementById('cCustos').getContext('2d');
  charts.cCustos=new Chart(ctx,{type:'doughnut',data:{labels,datasets:[{data:labels.map(k=>cats[k]),backgroundColor:['#3B5132','#638854','#8BA872','#EE6B1B','#F9B218','#2A5EA9','#D8E1D4','#C0392B','#6B21A8','#374151','#F97316'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},boxWidth:12}}}}});
}

function renderChartStatus(){
  killChart('cStatus');
  const counts={};
  DB.obras.forEach(o=>{ counts[o.status]=(counts[o.status]||0)+1; });
  const empty=document.getElementById('cStatusEmpty');
  if(!Object.keys(counts).length){ empty.style.display='flex'; return; }
  empty.style.display='none';
  const colors={'Em negociação':'#6B7280','Contrato assinado':'#6B21A8','Em produção':'#1E40AF','Em montagem':'#D97706','Entregue':'#15803D','Cancelado':'#C0392B'};
  const ctx=document.getElementById('cStatus').getContext('2d');
  charts.cStatus=new Chart(ctx,{type:'pie',data:{labels:Object.keys(counts),datasets:[{data:Object.values(counts),backgroundColor:Object.keys(counts).map(k=>colors[k]||'#999'),borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},boxWidth:12}}}}});
}

// ═══════════════════════════════════════════════════
// OBRAS
// ═══════════════════════════════════════════════════
const OBRAS_COLS = [
  {key:'n', label:'#', noSort:true, filterable:false},
  {key:'cliente', label:'Cliente'},
  {key:'modelo', label:'Modelo'},
  {key:'dtC', label:'Dt. Contrato'},
  {key:'status', label:'Status'},
  {key:'venda', label:'Venda'},
  {key:'custos', label:'Custos lançados'},
  {key:'resultado', label:'Resultado'},
  {key:'margem', label:'Margem'},
];
function obrasValorDe(o, col){
  const c = calcObra(o);
  switch(col.key){
    case 'cliente': return o.cliente||'';
    case 'modelo': return o.modelo||'';
    case 'dtC': return o.dtC||'';
    case 'status': return o.status||'';
    case 'venda': return n(o.venda);
    case 'custos': return c.custos;
    case 'resultado': return o.status==='Entregue'?c.resultado:-Infinity;
    case 'margem': return o.status==='Entregue'?c.margem:-Infinity;
    default: return '';
  }
}
function renderObras(){
  if(!tableStates['obras']) tableStates['obras'] = { sortKey:'dtC', sortDir:-1, filtros:{}, busca:'' };
  montarBarraTabela('obras','tbarObras',renderObras);
  document.getElementById('theadObras').innerHTML = montarCabecalhoOrdenavel('obras', OBRAS_COLS, '<th></th>');
  const todas = DB.obras;
  const list = aplicarFiltroOrdenacao('obras', OBRAS_COLS, todas, obrasValorDe);
  ligarEventosCabecalho('obras', OBRAS_COLS, todas, obrasValorDe, renderObras);
  const tb=document.getElementById('tbObras');
  const em=document.getElementById('emptyObras');
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; badges(); return; }
  em.style.display='none';
  tb.innerHTML=list.map((o,i)=>{
    const c=calcObra(o);
    const mCls=c.margem>=35?'pos':c.margem>=20?'':'neg';
    const custosLancados=DB.pagar.filter(p=>p.obraId===o.id&&isObraCat(p.cat)).length;
    return `<tr>
      <td data-csp-style="color:var(--tm);font-size:11px">${list.length-i}</td>
      <td><strong>${escapeHtml(o.cliente)}</strong><div class="tdim">${escapeHtml(o.cidade||'')} ${o.dtC?'· '+fmtDate(o.dtC):''}</div></td>
      <td>${escapeHtml(o.modelo)}</td>
      <td>${fmtDate(o.dtC)}</td>
      <td>${sbadge(o.status)}</td>
      <td class="tr mono">${BRL(n(o.venda))}</td>
      <td class="tr"><span data-csp-style="font-size:12px">${BRL(c.custos)}</span><div class="tdim tc">${custosLancados} lançamento${custosLancados!==1?'s':''}</div></td>
      <td class="tr mono ${o.status==='Entregue'?(c.resultado>=0?'pos':'neg'):''}">${o.status==='Entregue'?BRL(c.resultado):'—'}</td>
      <td class="tr ${o.status==='Entregue'?mCls:''}">${o.status==='Entregue'?PCT(c.margem):'—'}</td>
      <td><div data-csp-style="display:flex;gap:6px;white-space:nowrap">
        <button class="btn bs bsm" data-fin-dynamic-call="verResultadoObra" data-fin-dynamic-id="${escapeAttr(o.id)}">📊 Resultado</button>
        <button class="btn bs bsm" data-fin-dynamic-call="editObra" data-fin-dynamic-id="${escapeAttr(o.id)}">Editar</button>
        <button class="btn bs bsm" data-fin-dynamic-call="openPagModal" data-fin-dynamic-id="${escapeAttr(o.id)}">+ Custo</button>
      </div></td>
    </tr>`;
  }).join('');
  badges();
}

function openObraModal(id){
  clearObraForm();
  document.getElementById('mObraTitle').textContent = id ? 'Editar obra' : 'Nova obra';
  document.getElementById('oId').value = '';
  document.getElementById('btnDelObra').style.display='none';
  document.getElementById('oDtC').value = new Date().toISOString().slice(0,10);
  if(id) fillObraForm(id);
  syncAllDateButtons();
  // Em edição, os lançamentos de "A Receber" já foram gerados — o valor de
  // venda e a forma de recebimento não podem mais ser alterados por aqui
  // (evita duplicar/gerar novos lançamentos). Ajuste os valores em "A Receber".
  document.getElementById('oValoresSec').style.display = id ? 'none' : '';
  document.querySelector('#mObra .msub').textContent = id
    ? 'Dados da obra. O valor de venda e os lançamentos já gerados podem ser ajustados na aba "A Receber".'
    : 'Informe o valor de venda e como será recebido — os lançamentos em A Receber são gerados automaticamente.';
  document.getElementById('mObra').classList.add('open');
}

function clearObraForm(){
  ['oCliente','oCidade','oFPag','oObs','oEnt','oDtEnt','oParc','oNParc','oDtParc1','oPerm','oPermDesc','oSaldo','oDtE','oVenda','oEntChequeBanco','oSaldoChequeBanco'].forEach(f=>{
    const el=document.getElementById(f); if(el) el.value='';
  });
  document.getElementById('oStatus').value='Em negociação';
  document.getElementById('oTipoEnt').value='Entrada';
  document.getElementById('oEntRecebida').checked=false;
  document.getElementById('oPermRecebida').checked=false;
  document.getElementById('oSaldoRecebido').checked=false;
  document.getElementById('oEntForma').value='Dinheiro';
  document.getElementById('oParcForma').value='Dinheiro';
  document.getElementById('oSaldoForma').value='Dinheiro';
  onObraEntRecebidaChange();
  onObraSaldoRecebidaChange();
  document.getElementById('parcelasPreview').style.display='none';
}

function onObraEntRecebidaChange(){
  const jaRec=document.getElementById('oEntRecebida').checked;
  const forma=document.getElementById('oEntForma').value;
  document.getElementById('oEntContaDiv').style.display = (jaRec && forma!=='Cheque') ? 'block' : 'none';
  document.getElementById('oEntChequeDiv').style.display = (jaRec && forma==='Cheque') ? 'block' : 'none';
  if(jaRec && forma!=='Cheque') fillContaSelect('oEntConta');
}
function onObraSaldoRecebidaChange(){
  const jaRec=document.getElementById('oSaldoRecebido').checked;
  const forma=document.getElementById('oSaldoForma').value;
  document.getElementById('oSaldoContaDiv').style.display = (jaRec && forma!=='Cheque') ? 'block' : 'none';
  document.getElementById('oSaldoChequeDiv').style.display = (jaRec && forma==='Cheque') ? 'block' : 'none';
  if(jaRec && forma!=='Cheque') fillContaSelect('oSaldoConta');
}

function fillObraForm(id){
  const o=DB.obras.find(x=>x.id===id);
  if(!o) return;
  document.getElementById('oId').value=id;
  document.getElementById('btnDelObra').style.display='inline-flex';
  document.getElementById('oCliente').value=o.cliente||'';
  document.getElementById('oModelo').value=o.modelo||'Chalé 40m²';
  document.getElementById('oDtC').value=o.dtC||'';
  document.getElementById('oStatus').value=o.status||'Em negociação';
  document.getElementById('oCidade').value=o.cidade||'';
  document.getElementById('oDtE').value=o.dtE||'';
  document.getElementById('oVenda').value=o.venda||'';
  document.getElementById('oFPag').value=o.fPag||'';
  document.getElementById('oObs').value=o.obs||'';
  // Não re-gera parcelas em edição — já existem
}

function previewParcelas(){
  const nParc=n(document.getElementById('oNParc').value);
  const valorParc=n(document.getElementById('oParc').value);
  const dt1=document.getElementById('oDtParc1').value;
  const prev=document.getElementById('parcelasPreview');
  if(!nParc||!valorParc){ prev.style.display='none'; return; }
  const vParc=(valorParc/nParc).toFixed(2);
  let txt=`Serão criadas <strong>${nParc} parcelas</strong> de <strong>${BRL(+vParc)}</strong>`;
  if(dt1){
    const datas=Array.from({length:Math.min(nParc,3)},(_,i)=>fmtDate(addMonths(dt1,i)));
    txt+=` — ${datas.join(', ')}${nParc>3?`... (até ${fmtDate(addMonths(dt1,nParc-1))})`:''}`;
  }
  prev.innerHTML=txt;
  prev.style.display='block';
}

function calcObraPreview(){ previewParcelas(); }

async function saveObra(){
 try{
  const cliente=document.getElementById('oCliente').value.trim();
  if(!cliente){ toast('Informe o nome do cliente.', true); return; }
  const venda=n(document.getElementById('oVenda').value);
  const id=document.getElementById('oId').value||uid();
  const isNew=!document.getElementById('oId').value;

  const o={
    id, cliente,
    modelo:document.getElementById('oModelo').value,
    dtC:document.getElementById('oDtC').value,
    dtE:document.getElementById('oDtE').value,
    status:document.getElementById('oStatus').value,
    cidade:document.getElementById('oCidade').value,
    venda, fPag:document.getElementById('oFPag').value,
    obs:document.getElementById('oObs').value,
  };

  const idx=DB.obras.findIndex(x=>x.id===id);
  if(idx>=0) DB.obras[idx]=o; else DB.obras.push(o);

  // Gera A Receber apenas para obras novas — e junta um resumo pra confirmar pro usuário
  const resumo=[];
  if(isNew){
    const dtBase=o.dtC||new Date().toISOString().slice(0,10);
    // Entrada
    const ent=n(document.getElementById('oEnt').value);
    if(ent>0){
      const jaRecebida=document.getElementById('oEntRecebida').checked;
      const entForma=document.getElementById('oEntForma').value;
      const entVenc=document.getElementById('oDtEnt').value||dtBase;
      const entId=uid();
      const entContaId=(jaRecebida&&entForma!=='Cheque')?document.getElementById('oEntConta').value:'';
      DB.receber.push({ id:entId, obraId:id, tipo:document.getElementById('oTipoEnt').value,
        desc:'Entrada', venc:entVenc,
        prev:ent, rec:jaRecebida?ent:0, status:jaRecebida?'Recebido':'Pendente', obs:'',
        forma:jaRecebida?entForma:'', contaId:entContaId });
      if(jaRecebida&&entForma==='Cheque'){
        criarCheque({ valor:ent, vencimento:entVenc, banco:document.getElementById('oEntChequeBanco').value, recId:entId });
      }
      resumo.push(`Entrada: ${BRL(ent)} (${jaRecebida?'já recebida — '+entForma:'pendente'})`);
    }
    // Parcelas
    const totalParc=n(document.getElementById('oParc').value);
    const nParc=n(document.getElementById('oNParc').value);
    // Se a data da 1ª parcela não foi preenchida, usa a data do contrato como
    // padrão — sem isso, o restante do valor (as parcelas) era descartado
    // silenciosamente e nunca aparecia em "A Receber".
    const dt1=document.getElementById('oDtParc1').value||dtBase;
    const parcForma=document.getElementById('oParcForma').value;
    if(totalParc>0&&nParc>0){
      const vParc=+(totalParc/nParc).toFixed(2);
      const resto=+(totalParc-(vParc*(nParc-1))).toFixed(2);
      for(let i=0;i<nParc;i++){
        DB.receber.push({ id:uid(), obraId:id, tipo:'Parcela',
          desc:`Parcela ${i+1}/${nParc}`, venc:addMonths(dt1,i),
          prev:i===nParc-1?resto:vParc, rec:0, status:'Pendente', obs:'', forma:parcForma, contaId:'' });
      }
      resumo.push(`Parcelas: ${nParc}x, total ${BRL(totalParc)} (pendentes, forma prevista: ${parcForma})`);
    }
    // Permuta
    const perm=n(document.getElementById('oPerm').value);
    if(perm>0){
      const permJaRecebida=document.getElementById('oPermRecebida').checked;
      let seguirComPermuta=true;
      if(permJaRecebida) seguirComPermuta=await checarLimitePermuta(perm);
      const permId=uid();
      const permOk=permJaRecebida&&seguirComPermuta;
      DB.receber.push({ id:permId, obraId:id, tipo:'Permuta',
        desc:'Permuta — '+(document.getElementById('oPermDesc').value||'Bem recebido'),
        venc:dtBase, prev:perm, rec:permOk?perm:0, status:permOk?'Recebido':'Pendente', obs:'',
        forma:permOk?'Permuta':'', contaId:'' });
      if(permOk){
        criarPermuta({ valor:perm, descricao:document.getElementById('oPermDesc').value, recId:permId });
      }
      resumo.push(`Permuta: ${BRL(perm)} (${permOk?'já recebida':'pendente'})`);
    }
    // Saldo na entrega
    const saldo=n(document.getElementById('oSaldo').value);
    if(saldo>0){
      const saldoRecebido=document.getElementById('oSaldoRecebido').checked;
      const saldoForma=document.getElementById('oSaldoForma').value;
      const saldoId=uid();
      const saldoContaId=(saldoRecebido&&saldoForma!=='Cheque')?document.getElementById('oSaldoConta').value:'';
      DB.receber.push({ id:saldoId, obraId:id, tipo:'Saldo entrega',
        desc:'Saldo na entrega', venc:o.dtE||'', prev:saldo, rec:saldoRecebido?saldo:0,
        status:saldoRecebido?'Recebido':'Pendente', obs:'',
        forma:saldoRecebido?saldoForma:'', contaId:saldoContaId });
      if(saldoRecebido&&saldoForma==='Cheque'){
        criarCheque({ valor:saldo, vencimento:o.dtE||dtBase, banco:document.getElementById('oSaldoChequeBanco').value, recId:saldoId });
      }
      resumo.push(`Saldo na entrega: ${BRL(saldo)} (${saldoRecebido?'já recebido — '+saldoForma:'pendente'})`);
    }
  }

  // Comissão de vendas — sempre vinculada a esta obra específica, como um
  // lançamento real em "A Pagar" (nunca descontada "por fora"). Sempre que o
  // valor de venda mudar, o valor da comissão é recalculado automaticamente:
  // - o valor já pago NUNCA é perdido/zerado;
  // - se já havia algo pago e o valor mudou, o lançamento volta para
  //   "Pendente" para facilitar localizar e conferir a diferença.
  const comissaoResumo = syncComissaoObra(o, isNew);
  if(comissaoResumo) resumo.push(comissaoResumo);

  save(); closeModal('mObra'); renderObras(); renderPag(); renderDash(); badges();
  if(isNew){
    if(resumo.length){
      await avisar('Obra cadastrada!\n\nLançamentos gerados em "A Receber":\n— '+resumo.join('\n— '), '✅ Obra cadastrada');
    }else{
      await avisar('Obra cadastrada!\n\nNenhum lançamento foi gerado em "A Receber" — nenhum valor de entrada, parcela, permuta ou saldo foi informado.', '✅ Obra cadastrada');
    }
  }else{
    toast(comissaoResumo ? 'Obra atualizada — ' + comissaoResumo : 'Obra atualizada com sucesso.');
  }
 }catch(e){
   console.error('Erro ao salvar obra:', e);
   toast('Ocorreu um erro ao salvar a obra. Abra o console do navegador (F12) para detalhes.', true);
 }
}

function editObra(id){ openObraModal(id); }

async function deleteObra(){
  const id=document.getElementById('oId').value;
  if(!id) return;
  if(!(await confirmarAcao('Excluir esta obra e todos os seus recebimentos vinculados? Esta ação não pode ser desfeita.'))) return;
  DB.obras=DB.obras.filter(o=>o.id!==id);
  DB.receber=DB.receber.filter(r=>r.obraId!==id);
  save(); closeModal('mObra'); renderObras(); renderDash(); badges();
  toast('Obra excluída.');
}

// ═══════════════════════════════════════════════════
// FORNECEDORES
// ═══════════════════════════════════════════════════
let fornModalContext=null; // 'pagar' quando o cadastro foi aberto a partir do lançamento de A Pagar

function renderFornecedores(){
  const tb=document.getElementById('tbForn');
  const em=document.getElementById('emptyForn');
  const list=DB.fornecedores||[];
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; badges(); return; }
  em.style.display='none';
  tb.innerHTML=list.slice().sort((a,b)=>(a.nome||'').localeCompare(b.nome||'')).map(f=>`
    <tr>
      <td><strong>${escapeHtml(f.nome)}</strong>${f.obs?`<div class="tdim">${escapeHtml(f.obs)}</div>`:''}</td>
      <td>${escapeHtml(f.telefone||'')}</td>
      <td>${escapeHtml(f.categoria||'—')}</td>
      <td>${escapeHtml(f.cnpj||'—')}</td>
      <td><button class="btn bs bsm" data-fin-dynamic-call="openFornecedorModal" data-fin-dynamic-id="${escapeAttr(f.id)}">Editar</button></td>
    </tr>`).join('');
  badges();
}

// ═══════════════════════════════════════════════════
// CHEQUES, PERMUTAS E SALDOS (base do Fluxo de Caixa)
// ═══════════════════════════════════════════════════
// Preenche um <select> com as contas cadastradas (Caixa/Bancos)
function fillContaSelect(selId, vazio=true){
  const sel=document.getElementById(selId);
  if(!sel) return;
  const cur=sel.value;
  sel.innerHTML = vazio ? '<option value="">Selecione a conta</option>' : '';
  (DB.contas||[]).forEach(c=>{ const opt=document.createElement('option'); opt.value=c.id; opt.textContent=c.nome; sel.appendChild(opt); });
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}

function criarCheque({valor, vencimento, banco, recId}){
  if(!DB.cheques) DB.cheques=[];
  const ch={ id:uid(), valor:n(valor), vencimento:vencimento||'', banco:banco||'', status:'Em carteira', recId:recId||'', contaDestinoId:'', pagarId:'' };
  DB.cheques.push(ch);
  return ch;
}
function criarPermuta({valor, descricao, recId}){
  if(!DB.permutas) DB.permutas=[];
  const pm={ id:uid(), valor:n(valor), descricao:descricao||'Bem recebido', status:'Ativa', recId:recId||'', pagarId:'' };
  DB.permutas.push(pm);
  return pm;
}
function saldoConta(contaId){
  const conta=(DB.contas||[]).find(c=>c.id===contaId);
  if(!conta) return 0;
  const entradas=DB.receber.filter(r=>r.contaId===contaId).reduce((s,r)=>s+n(r.rec),0);
  const depositos=(DB.cheques||[]).filter(c=>c.status==='Depositado'&&c.contaDestinoId===contaId).reduce((s,c)=>s+n(c.valor),0);
  const saidas=DB.pagar.filter(p=>p.contaId===contaId).reduce((s,p)=>s+n(p.pago),0);
  return n(conta.saldoInicial)+entradas+depositos-saidas;
}
function totalDinheiroDisponivel(){ return (DB.contas||[]).reduce((s,c)=>s+saldoConta(c.id),0); }
function totalChequesCarteira(){ return (DB.cheques||[]).filter(c=>c.status==='Em carteira').reduce((s,c)=>s+n(c.valor),0); }
function totalPermutasAtivas(){ return (DB.permutas||[]).filter(p=>p.status==='Ativa').reduce((s,p)=>s+n(p.valor),0); }

// % que as permutas ativas representam sobre o saldo (dinheiro + permutas),
// simulando a inclusão de uma nova permuta ainda não salva (incluirExtra).
function pctPermutaAtual(incluirExtra=0){
  const dinheiro=totalDinheiroDisponivel();
  const permutas=totalPermutasAtivas()+n(incluirExtra);
  const base=dinheiro+permutas;
  return base>0 ? (permutas/base*100) : 0;
}
// Avisa (sem bloquear) se uma nova permuta ultrapassar o limite configurado.
async function checarLimitePermuta(valorNovaPermuta){
  const limite=n(DB.config.limitePermuta);
  if(!limite) return true;
  const pct=pctPermutaAtual(valorNovaPermuta);
  if(pct>limite){
    return await confirmarAcao(
      `Atenção: com esta permuta de ${BRL(n(valorNovaPermuta))}, as permutas ativas ficariam em ${PCT(pct)} do seu saldo — acima do limite configurado de ${PCT(limite)}. Deseja continuar mesmo assim?`,
      { textoBotao:'Continuar mesmo assim' }
    );
  }
  return true;
}

// ═══════════════════════════════════════════════════
// FLUXO DE CAIXA (Visão geral + Cheques + Permutas)
// ═══════════════════════════════════════════════════
function switchFcTab(tab){
  document.querySelectorAll('#fluxocaixa .tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('fcTab_'+tab).classList.add('active');
  document.querySelectorAll('#fluxocaixa .tab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById('fcContent_'+tab).classList.add('active');
  if(tab==='geral') renderFluxoCaixa();
  else if(tab==='cheques') renderCheques();
  else if(tab==='permutas') renderPermutas();
}
function renderFluxoCaixaSection(){ switchFcTab('geral'); }

function renderFluxoCaixa(){
  const sel=document.getElementById('fcPer');
  const cur=sel.value;
  sel.innerHTML='<option value="all">Acumulado geral</option>';
  getMeses().forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=fmtMes(m); if(m===cur)o.selected=true; sel.appendChild(o); });
  if(sel.__syncSelBtn) sel.__syncSelBtn();
  const mes=sel.value;
  const noPeriodo=venc=>mes==='all'||(venc||'').startsWith(mes);

  // Movimentação do período — usa os mesmos dados de A Receber/A Pagar já
  // existentes (regime de caixa: só o que foi de fato recebido/pago)
  const entradas=DB.receber.filter(r=>r.status==='Recebido'&&noPeriodo(r.venc));
  const saidas=DB.pagar.filter(p=>p.status==='Pago'&&noPeriodo(p.venc));
  const totalEnt=entradas.reduce((s,r)=>s+n(r.rec),0);
  const totalSai=saidas.reduce((s,p)=>s+n(p.pago),0);

  document.getElementById('tbFcEntradas').innerHTML = entradas.length ? entradas.map(r=>{
    const obra=DB.obras.find(o=>o.id===r.obraId);
    return `<tr><td>${fmtDate(r.venc)}</td><td>${escapeHtml(obra?obra.cliente:(r.desc||'Avulso'))}</td><td>${escapeHtml(r.forma||'—')}</td><td class="tr mono">${BRL(n(r.rec))}</td></tr>`;
  }).join('') : '<tr><td colspan="4" class="tc" data-csp-style="padding:16px;color:var(--tm)">Nenhuma entrada no período</td></tr>';

  document.getElementById('tbFcSaidas').innerHTML = saidas.length ? saidas.map(p=>{
    const forn=(DB.fornecedores||[]).find(f=>f.id===p.fornecedorId);
    return `<tr><td>${fmtDate(p.venc)}</td><td>${escapeHtml(forn?forn.nome:(p.desc||p.cat))}</td><td>${escapeHtml(p.forma||'—')}</td><td class="tr mono">${BRL(n(p.pago))}</td></tr>`;
  }).join('') : '<tr><td colspan="4" class="tc" data-csp-style="padding:16px;color:var(--tm)">Nenhuma saída no período</td></tr>';

  document.getElementById('fcRazaoKpis').innerHTML = `
    <div class="kpi green"><div class="kpi-lbl">Entradas do período</div><div class="kpi-val">${BRL(totalEnt)}</div></div>
    <div class="kpi red"><div class="kpi-lbl">Saídas do período</div><div class="kpi-val">${BRL(totalSai)}</div></div>
    <div class="kpi ${(totalEnt-totalSai)>=0?'green':'red'}"><div class="kpi-lbl">Saldo do período</div><div class="kpi-val">${BRL(totalEnt-totalSai)}</div></div>
  `;

  // Razão — posição atual, independe do período filtrado acima
  const dinheiro=totalDinheiroDisponivel();
  const chequesCarteira=totalChequesCarteira();
  const permutasAtivas=totalPermutasAtivas();
  const totalGeral=dinheiro+chequesCarteira+permutasAtivas;
  const linhasContas=(DB.contas||[]).map(c=>`<tr><td>${escapeHtml(c.nome)}</td><td class="tr mono">${BRL(saldoConta(c.id))}</td></tr>`).join('');
  document.getElementById('tbRazao').innerHTML = `
    ${linhasContas || '<tr><td colspan="2" data-csp-style="color:var(--tm)">Nenhuma conta cadastrada</td></tr>'}
    <tr data-csp-style="background:var(--gp)"><td><strong>Dinheiro disponível</strong></td><td class="tr mono"><strong>${BRL(dinheiro)}</strong></td></tr>
    <tr><td>Cheques em carteira (${(DB.cheques||[]).filter(c=>c.status==='Em carteira').length})</td><td class="tr mono">${BRL(chequesCarteira)}</td></tr>
    <tr><td>Permutas ativas (${(DB.permutas||[]).filter(p=>p.status==='Ativa').length})</td><td class="tr mono">${BRL(permutasAtivas)}</td></tr>
    <tr data-csp-style="background:var(--gp)"><td><strong>TOTAL GERAL</strong></td><td class="tr mono"><strong>${BRL(totalGeral)}</strong></td></tr>
  `;

  // Alerta de limite de permuta (configurado em Configurações)
  const limite=n(DB.config.limitePermuta);
  const pctAtual=pctPermutaAtual(0);
  const alertaEl=document.getElementById('fcAlertaPermuta');
  if(limite>0 && pctAtual>limite){
    alertaEl.innerHTML=`<div class="box bx-red"><div class="box-icon">⚠️</div><div>Permutas ativas representam <strong>${PCT(pctAtual)}</strong> do seu saldo — acima do limite configurado de ${PCT(limite)}.</div></div>`;
  } else if(limite>0){
    alertaEl.innerHTML=`<div class="box bx-green"><div class="box-icon">✅</div><div>Permutas ativas: ${PCT(pctAtual)} do saldo (limite configurado: ${PCT(limite)}).</div></div>`;
  } else {
    alertaEl.innerHTML='';
  }

  killChart('cFluxo');
  const ctx=document.getElementById('cFluxo').getContext('2d');
  charts.cFluxo=new Chart(ctx,{type:'bar',data:{labels:['Entradas','Saídas'],datasets:[{data:[totalEnt,totalSai],backgroundColor:['#15803D','#C0392B'],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});

  renderFluxoEvolucao();
}

// Últimos 12 meses (incluindo o mês atual), no formato 'YYYY-MM'
function ultimos12Meses(){
  const meses=[];
  const hoje=new Date();
  for(let i=11;i>=0;i--){
    const d=new Date(hoje.getFullYear(), hoje.getMonth()-i, 1);
    meses.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));
  }
  return meses;
}

const FORMAS_BANCO=['PIX','Transferência','Cartão','Boleto'];

function renderFluxoEvolucao(){
  const meses=ultimos12Meses();
  const entradas=meses.map(m=>DB.receber.filter(r=>r.status==='Recebido'&&(r.venc||'').startsWith(m)).reduce((s,r)=>s+n(r.rec),0));
  const saidas=meses.map(m=>DB.pagar.filter(p=>p.status==='Pago'&&(p.venc||'').startsWith(m)).reduce((s,p)=>s+n(p.pago),0));
  const saldo=meses.map((m,i)=>entradas[i]-saidas[i]);
  const porForma=(forma,m)=>DB.receber.filter(r=>r.status==='Recebido'&&(r.venc||'').startsWith(m)&&(Array.isArray(forma)?forma.includes(r.forma):r.forma===forma)).reduce((s,r)=>s+n(r.rec),0);
  const dinheiro=meses.map(m=>porForma('Dinheiro',m));
  const bancos=meses.map(m=>porForma(FORMAS_BANCO,m));
  const cheques=meses.map(m=>porForma('Cheque',m));
  const permutas=meses.map(m=>porForma('Permuta',m));

  killChart('cFluxoEvolucao');
  const ctx=document.getElementById('cFluxoEvolucao').getContext('2d');
  charts.cFluxoEvolucao=new Chart(ctx,{
    data:{
      labels:meses.map(fmtMes),
      datasets:[
        { type:'bar', label:'Entradas', data:entradas, backgroundColor:'#15803D', order:5 },
        { type:'bar', label:'Saídas', data:saidas, backgroundColor:'#C0392B', order:5 },
        { type:'line', label:'Saldo do período', data:saldo, borderColor:'#111827', borderWidth:2.5, borderDash:[6,4], pointRadius:2, fill:false, tension:0.25, order:1 },
        { type:'line', label:'Dinheiro', data:dinheiro, borderColor:'#F59E0B', borderWidth:2, pointRadius:2, fill:false, tension:0.25, order:2 },
        { type:'line', label:'Bancos', data:bancos, borderColor:'#2A5EA9', borderWidth:2, pointRadius:2, fill:false, tension:0.25, order:2 },
        { type:'line', label:'Cheques', data:cheques, borderColor:'#7C3AED', borderWidth:2, pointRadius:2, fill:false, tension:0.25, order:2 },
        { type:'line', label:'Permutas', data:permutas, borderColor:'#EE6B1B', borderWidth:2, pointRadius:2, fill:false, tension:0.25, order:2 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:12, font:{size:11} } } },
      scales:{ y:{ ticks:{ callback:v=>BRL(v) } } }
    }
  });
}

function renderCheques(){
  const tb=document.getElementById('tbCheques');
  const em=document.getElementById('emptyCheques');
  const list=DB.cheques||[];
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; return; }
  em.style.display='none';
  tb.innerHTML=list.slice().sort((a,b)=>(a.vencimento||'').localeCompare(b.vencimento||'')).map(c=>`
    <tr>
      <td class="mono">${BRL(c.valor)}</td>
      <td>${fmtDate(c.vencimento)}</td>
      <td>${escapeHtml(c.banco||'—')}</td>
      <td><span class="badge ${{'Em carteira':'b-purple','Depositado':'b-green','Repassado':'b-blue','Devolvido':'b-red'}[c.status]||'b-gray'}">${escapeHtml(c.status)}</span></td>
      <td>${c.status==='Em carteira' ? `
        <div data-csp-style="display:flex;gap:6px;white-space:nowrap">
          <button class="btn bs bsm" data-fin-dynamic-call="abrirDepositoCheque" data-fin-dynamic-id="${escapeAttr(c.id)}">Depositar</button>
          <button class="btn brd bsm" data-fin-dynamic-call="devolverCheque" data-fin-dynamic-id="${escapeAttr(c.id)}">Devolvido</button>
        </div>` : '—'}</td>
    </tr>`).join('');
}

function abrirDepositoCheque(id){
  const c=(DB.cheques||[]).find(x=>x.id===id);
  if(!c) return;
  fillContaSelect('chDepositoConta');
  document.getElementById('chDepositoId').value=id;
  document.getElementById('chDepositoInfo').textContent=`${BRL(c.valor)} — venc. ${fmtDate(c.vencimento)}${c.banco?' — '+c.banco:''}`;
  document.getElementById('mChequeDeposito').classList.add('open');
}

function confirmarDepositoCheque(){
  const id=document.getElementById('chDepositoId').value;
  const contaId=document.getElementById('chDepositoConta').value;
  if(!contaId){ toast('Selecione a conta de destino.', true); return; }
  const c=(DB.cheques||[]).find(x=>x.id===id);
  if(!c) return;
  c.status='Depositado'; c.contaDestinoId=contaId;
  save(); closeModal('mChequeDeposito'); renderCheques(); renderFluxoCaixa();
  toast('Cheque depositado.');
}

async function devolverCheque(id){
  if(!(await confirmarAcao('Marcar este cheque como devolvido (sem fundo)? Ele sai da carteira sem virar dinheiro nem pagamento.'))) return;
  const c=(DB.cheques||[]).find(x=>x.id===id);
  if(!c) return;
  c.status='Devolvido';
  save(); renderCheques(); renderFluxoCaixa();
  toast('Cheque marcado como devolvido.');
}

function renderPermutas(){
  const tb=document.getElementById('tbPermutas');
  const em=document.getElementById('emptyPermutas');
  const list=DB.permutas||[];
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; return; }
  em.style.display='none';
  tb.innerHTML=list.map(p=>`
    <tr>
      <td class="mono">${BRL(p.valor)}</td>
      <td>${escapeHtml(p.descricao)}</td>
      <td><span class="badge ${{'Ativa':'b-purple','Usada':'b-blue','Baixada':'b-gray'}[p.status]||'b-gray'}">${escapeHtml(p.status)}</span></td>
      <td>${p.status==='Ativa' ? `<button class="btn brd bsm" data-fin-dynamic-call="baixarPermuta" data-fin-dynamic-id="${escapeAttr(p.id)}">Dar baixa</button>` : '—'}</td>
    </tr>`).join('');
}

async function baixarPermuta(id){
  if(!(await confirmarAcao('Dar baixa nesta permuta? Ela sai do cálculo de permutas ativas e do limite configurado.'))) return;
  const p=(DB.permutas||[]).find(x=>x.id===id);
  if(!p) return;
  p.status='Baixada';
  save(); renderPermutas(); renderFluxoCaixa();
  toast('Permuta baixada.');
}


function fillFornecedorSelect(selId){
  const sel=document.getElementById(selId);
  if(!sel) return;
  const cur=sel.value;
  sel.innerHTML='<option value="">Selecione um fornecedor (opcional)</option><option value="__novo__">+ Cadastrar novo fornecedor</option>';
  (DB.fornecedores||[]).slice().sort((a,b)=>(a.nome||'').localeCompare(b.nome||'')).forEach(f=>{
    const opt=document.createElement('option'); opt.value=f.id; opt.textContent=f.nome; sel.appendChild(opt);
  });
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}

function openFornecedorModal(id, fromPagar){
  fornModalContext = fromPagar ? 'pagar' : null;
  document.getElementById('mFornTitle').textContent = id ? 'Editar fornecedor' : 'Novo fornecedor';
  document.getElementById('fId').value='';
  document.getElementById('btnDelForn').style.display='none';
  ['fNome','fTelefone','fCnpj','fObs'].forEach(f=>document.getElementById(f).value='');
  document.getElementById('fCategoria').value='';
  if(id){
    const f=(DB.fornecedores||[]).find(x=>x.id===id);
    if(f){
      document.getElementById('fId').value=id;
      document.getElementById('btnDelForn').style.display='inline-flex';
      document.getElementById('fNome').value=f.nome||'';
      document.getElementById('fTelefone').value=f.telefone||'';
      document.getElementById('fCnpj').value=f.cnpj||'';
      document.getElementById('fCategoria').value=f.categoria||'';
      document.getElementById('fObs').value=f.obs||'';
    }
  }
  document.getElementById('mFornecedor').classList.add('open');
}

function closeFornecedorModal(){
  document.getElementById('mFornecedor').classList.remove('open');
  fornModalContext=null;
}

function saveFornecedor(){
  const nome=document.getElementById('fNome').value.trim();
  const telefone=document.getElementById('fTelefone').value.trim();
  if(!nome){ toast('Informe o nome do fornecedor.', true); return; }
  if(!telefone){ toast('Informe o telefone do fornecedor.', true); return; }
  const id=document.getElementById('fId').value||uid();
  const f={ id, nome, telefone,
    cnpj:document.getElementById('fCnpj').value.trim(),
    categoria:document.getElementById('fCategoria').value,
    obs:document.getElementById('fObs').value.trim() };
  if(!DB.fornecedores) DB.fornecedores=[];
  const idx=DB.fornecedores.findIndex(x=>x.id===id);
  if(idx>=0) DB.fornecedores[idx]=f; else DB.fornecedores.push(f);
  save();
  const vindoDoPagar=fornModalContext==='pagar';
  closeFornecedorModal();
  fillFornecedorSelect('pFornecedor');
  if(vindoDoPagar) document.getElementById('pFornecedor').value=id;
  if(document.getElementById('fornecedores').classList.contains('active')) renderFornecedores();
  badges();
  toast('Fornecedor salvo.');
}

async function deleteFornecedor(){
  const id=document.getElementById('fId').value;
  if(!id) return;
  if(!(await confirmarAcao('Excluir este fornecedor? Lançamentos de A Pagar que já usam esse fornecedor mantêm a descrição, mas perdem o vínculo.'))) return;
  DB.fornecedores=DB.fornecedores.filter(x=>x.id!==id);
  save(); closeFornecedorModal(); fillFornecedorSelect('pFornecedor'); renderFornecedores(); badges();
  toast('Fornecedor excluído.');
}

// ═══════════════════════════════════════════════════
// CONTAS
// ═══════════════════════════════════════════════════
function renderContas(){
  const tb=document.getElementById('tbContas');
  const em=document.getElementById('emptyContas');
  const list=DB.contas||[];
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; return; }
  em.style.display='none';
  tb.innerHTML=list.map(c=>{
    const tipoNome=(DB.tiposConta||[]).find(t=>t.id===c.tipo)?.nome || c.tipo || '—';
    return `<tr>
      <td><strong>${escapeHtml(c.nome)}</strong></td>
      <td>${escapeHtml(tipoNome)}</td>
      <td class="tr mono">${BRL(n(c.saldoInicial))}</td>
      <td><button class="btn bs bsm" data-fin-dynamic-call="openContaModal" data-fin-dynamic-id="${escapeAttr(c.id)}">Editar</button></td>
    </tr>`;
  }).join('');
}

function openContaModal(id){
  document.getElementById('mContaTitle').textContent = id ? 'Editar conta' : 'Nova conta';
  document.getElementById('ctId').value='';
  document.getElementById('btnDelConta').style.display='none';
  document.getElementById('ctNome').value='';
  fillTiposContaSelect();
  document.getElementById('ctSaldo').value='';
  attachMoneyMask(document.getElementById('ctSaldo'));
  if(id){
    const c=(DB.contas||[]).find(x=>x.id===id);
    if(c){
      document.getElementById('ctId').value=id;
      document.getElementById('btnDelConta').style.display='inline-flex';
      document.getElementById('ctNome').value=c.nome||'';
      document.getElementById('ctTipo').value=c.tipo||'';
      document.getElementById('ctSaldo').value=n(c.saldoInicial)||'';
    }
  }
  document.getElementById('mConta').classList.add('open');
}

function saveConta(){
  const nome=document.getElementById('ctNome').value.trim();
  if(!nome){ toast('Informe o nome da conta.', true); return; }
  const id=document.getElementById('ctId').value||uid();
  const c={ id, nome, tipo:document.getElementById('ctTipo').value, saldoInicial:n(document.getElementById('ctSaldo').value) };
  if(!DB.contas) DB.contas=[];
  const idx=DB.contas.findIndex(x=>x.id===id);
  if(idx>=0) DB.contas[idx]=c; else DB.contas.push(c);
  save(); closeModal('mConta'); renderContas();
  toast('Conta salva.');
}

async function deleteConta(){
  const id=document.getElementById('ctId').value;
  if(!id) return;
  if(!(await confirmarAcao('Excluir esta conta?'))) return;
  DB.contas=DB.contas.filter(x=>x.id!==id);
  save(); closeModal('mConta'); renderContas();
  toast('Conta excluída.');
}

// Tipos de conta — lista editável pelo usuário
function fillTiposContaSelect(){
  const sel=document.getElementById('ctTipo');
  if(!sel) return;
  const cur=sel.value;
  sel.innerHTML=(DB.tiposConta||[]).map(t=>`<option value="${escapeAttr(t.id)}">${escapeHtml(t.nome)}</option>`).join('');
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}

function openTiposContaModal(){
  renderTiposContaList();
  document.getElementById('novoTipoConta').value='';
  document.getElementById('mTiposConta').classList.add('open');
}

function renderTiposContaList(){
  const wrap=document.getElementById('tiposContaList');
  const list=DB.tiposConta||[];
  wrap.innerHTML = list.length ? list.map(t=>`
    <div data-csp-style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <input value="${escapeAttr(t.nome)}" data-fin-dynamic-call="renomearTipoConta" data-fin-dynamic-id="${escapeAttr(t.id)}" data-fin-dynamic-value="current" data-csp-style="flex:1">
      <button class="btn bs bsm" type="button" title="Remover" data-fin-dynamic-call="removeTipoConta" data-fin-dynamic-id="${escapeAttr(t.id)}">🗑️</button>
    </div>`).join('') : '<p data-csp-style="color:var(--tm);font-size:13px">Nenhum tipo cadastrado.</p>';
}

function addTipoConta(){
  const nome=document.getElementById('novoTipoConta').value.trim();
  if(!nome){ toast('Informe o nome do tipo.', true); return; }
  if(!DB.tiposConta) DB.tiposConta=[];
  DB.tiposConta.push({ id:uid(), nome });
  save(); renderTiposContaList(); fillTiposContaSelect();
  document.getElementById('novoTipoConta').value='';
}

function renomearTipoConta(id, nome){
  const t=(DB.tiposConta||[]).find(x=>x.id===id);
  if(!t) return;
  t.nome=nome.trim()||t.nome;
  save(); fillTiposContaSelect();
}

async function removeTipoConta(id){
  if(!(await confirmarAcao('Remover este tipo de conta? Contas já cadastradas com esse tipo mantêm o valor salvo, mas ele não aparecerá mais na lista.'))) return;
  DB.tiposConta=(DB.tiposConta||[]).filter(x=>x.id!==id);
  save(); renderTiposContaList(); fillTiposContaSelect();
}

// ═══════════════════════════════════════════════════
// A RECEBER
// ═══════════════════════════════════════════════════
const REC_COLS = [
  {key:'cliente', label:'Obra / Cliente'},
  {key:'tipo', label:'Tipo'},
  {key:'desc', label:'Descrição'},
  {key:'venc', label:'Vencimento'},
  {key:'prev', label:'Previsto'},
  {key:'rec', label:'Recebido'},
  {key:'saldo', label:'Saldo'},
  {key:'status', label:'Status'},
];
function recValorDe(r, col){
  switch(col.key){
    case 'cliente': { const obra=DB.obras.find(o=>o.id===r.obraId); return obra?obra.cliente:'Avulso'; }
    case 'tipo': return r.tipo||'';
    case 'desc': return r.desc||'';
    case 'venc': return r.venc||'';
    case 'prev': return n(r.prev);
    case 'rec': return n(r.rec);
    case 'saldo': return n(r.prev)-n(r.rec);
    case 'status': return r.status||'';
    default: return '';
  }
}
function renderRec(){
  sincronizarVencidos();
  if(!tableStates['rec']) tableStates['rec'] = { sortKey:'venc', sortDir:1, filtros:{}, busca:'' };
  const totP=DB.receber.reduce((s,r)=>s+n(r.prev),0);
  const totR=DB.receber.reduce((s,r)=>s+n(r.rec),0);
  const aberto=totP-totR;
  const atraso=DB.receber.filter(r=>r.status==='Em atraso').reduce((s,r)=>s+n(r.prev)-n(r.rec),0);
  document.getElementById('kpiRec').innerHTML=`
    <div class="kpi"><div class="kpi-lbl">Total previsto</div><div class="kpi-val">${BRL(totP)}</div></div>
    <div class="kpi green"><div class="kpi-lbl">Recebido</div><div class="kpi-val pos">${BRL(totR)}</div></div>
    <div class="kpi gold"><div class="kpi-lbl">Em aberto</div><div class="kpi-val">${BRL(aberto)}</div></div>
    <div class="kpi ${atraso>0?'red':''}"><div class="kpi-lbl">Em atraso</div><div class="kpi-val ${atraso>0?'neg':''}">${BRL(atraso)}</div></div>
  `;
  montarBarraTabela('rec','tbarRec',renderRec);
  document.getElementById('theadRec').innerHTML = montarCabecalhoOrdenavel('rec', REC_COLS, '<th></th>');
  const todos = DB.receber;
  const list = aplicarFiltroOrdenacao('rec', REC_COLS, todos, recValorDe);
  ligarEventosCabecalho('rec', REC_COLS, todos, recValorDe, renderRec);
  const tb=document.getElementById('tbRec');
  const em=document.getElementById('emptyRec');
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; badges(); return; }
  em.style.display='none';
  const saldo=r=>n(r.prev)-n(r.rec);
  tb.innerHTML=list.map(r=>{
    const obra=DB.obras.find(o=>o.id===r.obraId);
    const sl=saldo(r);
    return `<tr>
      <td><strong>${obra?obra.cliente:'Avulso'}</strong><div class="tdim">${obra?obra.modelo:''}</div></td>
      <td>${escapeHtml(r.tipo)}</td>
      <td>${escapeHtml(r.desc||'—')}</td>
      <td>${fmtDate(r.venc)}</td>
      <td class="tr mono">${BRL(n(r.prev))}</td>
      <td class="tr mono pos">${n(r.rec)>0?BRL(n(r.rec)):'—'}</td>
      <td class="tr mono ${sl>0?'neg':''}">${BRL(sl)}</td>
      <td>${recStatusPickHtml(r)}</td>
      <td><button class="btn bs bsm" data-fin-dynamic-call="editRec" data-fin-dynamic-id="${escapeAttr(r.id)}">Editar</button></td>
    </tr>`;
  }).join('');
  ligarStatusPickersRec();
  badges();
}

function fillObraSelects(selId, vazio=false){
  const sel=document.getElementById(selId);
  if(!sel) return;
  sel.innerHTML=vazio?'<option value="">Sem vínculo (avulso)</option>':'<option value="">Selecione</option>';
  DB.obras.forEach(o=>{ const opt=document.createElement('option'); opt.value=o.id; opt.textContent=`${o.cliente} — ${o.modelo}`; sel.appendChild(opt); });
  if(sel.__syncSelBtn) sel.__syncSelBtn();
}

function onRecStatusChange(){
  const rec=document.getElementById('rStatus').value==='Recebido';
  document.getElementById('rFormaSec').style.display=rec?'block':'none';
  if(rec) onRecFormaChange();
}
function onRecFormaChange(){
  const forma=document.getElementById('rForma').value;
  document.getElementById('rContaDiv').style.display = (forma==='Cheque'||forma==='Permuta') ? 'none' : 'block';
  document.getElementById('rChequeDiv').style.display = forma==='Cheque' ? 'block' : 'none';
  document.getElementById('rChequeVencInfo').style.display = forma==='Cheque' ? 'block' : 'none';
  document.getElementById('rPermDiv').style.display = forma==='Permuta' ? 'block' : 'none';
  if(forma!=='Cheque'&&forma!=='Permuta') fillContaSelect('rConta');
}

function openRecModal(id){
  fillObraSelects('rObra',true);
  document.getElementById('mRecTitle').textContent=id?'Editar recebimento':'Novo recebimento';
  document.getElementById('rId').value='';
  document.getElementById('btnDelRec').style.display='none';
  ['rObra','rDesc','rVenc','rPrev','rRec','rObs','rChequeBanco','rPermDesc'].forEach(f=>document.getElementById(f).value='');
  document.getElementById('rTipo').value='Entrada';
  document.getElementById('rStatus').value='Pendente';
  document.getElementById('rForma').value='Dinheiro';
  document.getElementById('rVenc').value=new Date().toISOString().slice(0,10);
  onRecStatusChange();
  if(id) editRec(id,true);
  syncDateButton('rVenc');
  document.getElementById('mRec').classList.add('open');
}

function editRec(id, fromModal){
  const r=DB.receber.find(x=>x.id===id);
  if(!r) return;
  if(!fromModal){ openRecModal(id); return; }
  document.getElementById('mRecTitle').textContent='Editar recebimento';
  document.getElementById('rId').value=id;
  document.getElementById('btnDelRec').style.display='inline-flex';
  document.getElementById('rObra').value=r.obraId||'';
  document.getElementById('rTipo').value=r.tipo;
  document.getElementById('rDesc').value=r.desc||'';
  document.getElementById('rVenc').value=r.venc||'';
  document.getElementById('rPrev').value=r.prev||'';
  document.getElementById('rRec').value=r.rec||'';
  document.getElementById('rStatus').value=r.status;
  document.getElementById('rObs').value=r.obs||'';
  document.getElementById('rForma').value=r.forma||'Dinheiro';
  fillContaSelect('rConta');
  document.getElementById('rConta').value=r.contaId||'';
  document.getElementById('rChequeBanco').value='';
  document.getElementById('rPermDesc').value='';
  onRecStatusChange();
  onRecFormaChange();
}

async function saveRec(){
  const prev=n(document.getElementById('rPrev').value);
  if(!prev){ toast('Informe o valor previsto.', true); return; }
  const status=document.getElementById('rStatus').value;
  const rec=n(document.getElementById('rRec').value);
  const forma=document.getElementById('rForma').value;
  const id=document.getElementById('rId').value||uid();
  const existente=DB.receber.find(x=>x.id===id);

  // Validações da forma de recebimento, só quando o status é "Recebido"
  if(status==='Recebido'&&rec>0){
    if((forma!=='Cheque'&&forma!=='Permuta') && !document.getElementById('rConta').value){
      toast('Selecione a conta de destino do recebimento.', true); return;
    }
    if(forma==='Permuta'){
      const jaTinhaPermuta = existente && existente.forma==='Permuta' && (DB.permutas||[]).some(p=>p.recId===id);
      if(!jaTinhaPermuta && !(await checarLimitePermuta(rec))) return;
    }
  }

  const r={ id, obraId:document.getElementById('rObra').value, tipo:document.getElementById('rTipo').value,
    desc:document.getElementById('rDesc').value, venc:document.getElementById('rVenc').value,
    prev, rec, status,
    obs:document.getElementById('rObs').value,
    forma: status==='Recebido' ? forma : (existente?.forma||''),
    contaId: (status==='Recebido'&&forma!=='Cheque'&&forma!=='Permuta') ? document.getElementById('rConta').value : (existente?.contaId||'') };
  const idx=DB.receber.findIndex(x=>x.id===id);
  if(idx>=0) DB.receber[idx]=r; else DB.receber.push(r);

  // Gera o instrumento (cheque/permuta) só na primeira vez que este
  // recebimento é marcado como "Recebido" nessa forma — evita duplicar
  // o cheque/permuta em edições subsequentes do mesmo lançamento.
  if(status==='Recebido'&&rec>0){
    if(forma==='Cheque' && !(DB.cheques||[]).some(c=>c.recId===id)){
      criarCheque({ valor:rec, vencimento:r.venc, banco:document.getElementById('rChequeBanco').value, recId:id });
    }
    if(forma==='Permuta' && !(DB.permutas||[]).some(p=>p.recId===id)){
      criarPermuta({ valor:rec, descricao:document.getElementById('rPermDesc').value, recId:id });
    }
  }

  save(); closeModal('mRec'); renderRec(); renderDash();
}

async function deleteRec(){
  const id=document.getElementById('rId').value;
  if(!id) return;
  if(!(await confirmarAcao('Excluir este recebimento? Esta ação não pode ser desfeita.'))) return;
  DB.receber=DB.receber.filter(r=>r.id!==id);
  save(); closeModal('mRec'); renderRec(); renderDash();
  toast('Recebimento excluído.');
}

// ═══════════════════════════════════════════════════
// A PAGAR
// ═══════════════════════════════════════════════════
let pagFilter='all';
function filterPag(f,el){
  pagFilter=f;
  document.querySelectorAll('.tabs .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  renderPag();
}

const PAG_COLS = [
  {key:'desc', label:'Descrição'},
  {key:'cat', label:'Categoria'},
  {key:'obra', label:'Obra vinculada'},
  {key:'venc', label:'Vencimento'},
  {key:'valor', label:'Valor'},
  {key:'pago', label:'Pago'},
  {key:'status', label:'Status'},
];
function pagValorDe(p, col){
  switch(col.key){
    case 'desc': return p.desc||p.cat||'';
    case 'cat': return p.cat||'';
    case 'obra': { const obra=p.obraId?DB.obras.find(o=>o.id===p.obraId):null; return obra?obra.cliente:'Operacional'; }
    case 'venc': return p.venc||'';
    case 'valor': return n(p.valor);
    case 'pago': return n(p.pago);
    case 'status': return p.status||'';
    default: return '';
  }
}
function renderPag(){
  sincronizarVencidos();
  if(!tableStates['pag']) tableStates['pag'] = { sortKey:'venc', sortDir:1, filtros:{}, busca:'' };
  let baseList=DB.pagar;
  if(pagFilter==='obra') baseList=baseList.filter(p=>p.obraId&&isObraCat(p.cat));
  else if(pagFilter==='op') baseList=baseList.filter(p=>!p.obraId||!isObraCat(p.cat));
  else if(pagFilter==='atrasado') baseList=baseList.filter(p=>p.status==='Vencido');

  const all=DB.pagar;
  const totV=all.reduce((s,p)=>s+n(p.valor),0);
  const totP=all.filter(p=>p.status==='Pago').reduce((s,p)=>s+n(p.pago||p.valor),0);
  const pend=all.filter(p=>p.status!=='Pago').reduce((s,p)=>s+n(p.valor),0);
  const venc=all.filter(p=>p.status==='Vencido').reduce((s,p)=>s+n(p.valor),0);

  document.getElementById('kpiPag').innerHTML=`
    <div class="kpi"><div class="kpi-lbl">Total lançado</div><div class="kpi-val">${BRL(totV)}</div></div>
    <div class="kpi green"><div class="kpi-lbl">Total pago</div><div class="kpi-val pos">${BRL(totP)}</div></div>
    <div class="kpi gold"><div class="kpi-lbl">Pendente</div><div class="kpi-val">${BRL(pend)}</div></div>
    <div class="kpi ${venc>0?'red':''}"><div class="kpi-lbl">Vencido</div><div class="kpi-val ${venc>0?'neg':''}">${BRL(venc)}</div></div>
  `;

  montarBarraTabela('pag','tbarPag',renderPag);
  document.getElementById('theadPag').innerHTML = montarCabecalhoOrdenavel('pag', PAG_COLS, '<th></th>');
  const list = aplicarFiltroOrdenacao('pag', PAG_COLS, baseList, pagValorDe);
  ligarEventosCabecalho('pag', PAG_COLS, baseList, pagValorDe, renderPag);

  const tb=document.getElementById('tbPag');
  const em=document.getElementById('emptyPag');
  if(!list.length){ tb.innerHTML=''; em.style.display='block'; badges(); return; }
  em.style.display='none';

  tb.innerHTML=list.map(p=>{
    const obra=p.obraId?DB.obras.find(o=>o.id===p.obraId):null;
    const isRoy=p.cat==='Royalties';
    const isCom=p.cat==='Comissão';
    return `<tr class="${isRoy||isCom?'row-highlight':''}">
      <td><strong>${escapeHtml(p.desc||p.cat)}</strong>${isRoy?'<span class="badge b-orange" data-csp-style="margin-left:6px;font-size:10px">Royalties</span>':''}${isCom?'<span class="badge b-orange" data-csp-style="margin-left:6px;font-size:10px">Comissão</span>':''}
      <div class="tdim">${escapeHtml(p.nf||'')}</div></td>
      <td><span class="badge b-gray" data-csp-style="font-size:10px">${escapeHtml(p.cat)}</span></td>
      <td>${obra?`<strong>${escapeHtml(obra.cliente)}</strong><div class="tdim">${escapeHtml(obra.modelo)}</div>`:'<span data-csp-style="color:var(--tm);font-size:12px">Operacional</span>'}</td>
      <td>${fmtDate(p.venc)}</td>
      <td class="tr mono">${BRL(n(p.valor))}</td>
      <td class="tr mono ${p.pago?'pos':''}">${p.pago?BRL(n(p.pago)):'—'}</td>
      <td>${pbadge(p.status)}</td>
      <td><button class="btn bs bsm" data-fin-dynamic-call="editPag" data-fin-dynamic-id="${escapeAttr(p.id)}">Editar</button></td>
    </tr>`;
  }).join('');
  badges();
}

function onPagCatChange(){
  const cat=document.getElementById('pCat').value;
  const isObra=isObraCat(cat);
  document.getElementById('pObraDiv').style.display=isObra?'block':'none';
  const isNew=!document.getElementById('pId').value;
  // A caixa "Esta conta tem Royalties?" só faz sentido para um custo novo,
  // vinculado a uma obra, que não seja ele mesmo um lançamento de Royalties
  // ou Comissão (evita gerar royalties em cima de royalties/comissão).
  const podeTerRoyalties = isNew && isObra && cat!=='Royalties' && cat!=='Comissão';
  document.getElementById('pRoyDiv').style.display = podeTerRoyalties ? 'block' : 'none';
  if(!podeTerRoyalties){
    document.getElementById('pTemRoyalties').checked=false;
    document.getElementById('royCalc').style.display='none';
  }
}

function onPagRoyaltiesToggle(){
  const marcado=document.getElementById('pTemRoyalties').checked;
  document.getElementById('royCalc').style.display = marcado ? 'block' : 'none';
  if(marcado) calcRoyalties();
}

function calcRoyalties(){
  const val=n(document.getElementById('pValor').value);
  const pct=n(DB.config.royalties);
  const roy=+(val*pct/100).toFixed(2);
  document.getElementById('royValor').textContent=BRL(roy);
  document.getElementById('royCfg').textContent=pct;
  document.getElementById('royAjuste').value=roy||'';
}

function fillChequeCarteiraSelect(selId, currentPagarId){
  const sel=document.getElementById(selId);
  if(!sel) return;
  const cur=sel.value;
  const list=(DB.cheques||[]).filter(c=>c.status==='Em carteira' || (currentPagarId && c.pagarId===currentPagarId));
  sel.innerHTML = list.length ? list.map(c=>`<option value="${escapeAttr(c.id)}">${BRL(c.valor)} — venc. ${fmtDate(c.vencimento)}${c.banco?' — '+escapeHtml(c.banco):''}</option>`).join('') : '<option value="">Nenhum cheque em carteira</option>';
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}
function fillPermutaAtivaSelect(selId, currentPagarId){
  const sel=document.getElementById(selId);
  if(!sel) return;
  const cur=sel.value;
  const list=(DB.permutas||[]).filter(p=>p.status==='Ativa' || (currentPagarId && p.pagarId===currentPagarId));
  sel.innerHTML = list.length ? list.map(p=>`<option value="${escapeAttr(p.id)}">${BRL(p.valor)} — ${escapeHtml(p.descricao)}</option>`).join('') : '<option value="">Nenhuma permuta ativa</option>';
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}
function onPagStatusChange(){
  const pago=document.getElementById('pStatus').value==='Pago';
  document.getElementById('pFormaSec').style.display=pago?'block':'none';
  if(pago) onPagFormaChange();
}
function onPagFormaChange(){
  const forma=document.getElementById('pForma').value;
  const idAtual=document.getElementById('pId').value;
  document.getElementById('pContaDiv').style.display = (forma==='Cheque'||forma==='Permuta') ? 'none' : 'block';
  document.getElementById('pChequeDiv').style.display = forma==='Cheque' ? 'block' : 'none';
  document.getElementById('pPermDiv').style.display = forma==='Permuta' ? 'block' : 'none';
  if(forma==='Cheque') fillChequeCarteiraSelect('pChequeSel', idAtual);
  else if(forma==='Permuta') fillPermutaAtivaSelect('pPermSel', idAtual);
  else fillContaSelect('pConta');
}

function openPagModal(preObraId){
  fillObraSelects('pObra',false);
  fillFornecedorSelect('pFornecedor');
  document.getElementById('pFornecedor').value='';
  document.getElementById('mPagTitle').textContent='Novo lançamento';
  document.getElementById('pId').value='';
  document.getElementById('btnDelPag').style.display='none';
  ['pDesc','pVenc','pValor','pPago','pNF'].forEach(f=>document.getElementById(f).value='');
  document.getElementById('pTemRoyalties').checked=false;
  document.getElementById('pCat').value='Kit Fábrica';
  document.getElementById('pStatus').value='Pendente';
  document.getElementById('pForma').value='Dinheiro';
  document.getElementById('pVenc').value=new Date().toISOString().slice(0,10);
  if(preObraId) document.getElementById('pObra').value=preObraId;
  onPagCatChange();
  onPagStatusChange();
  syncDateButton('pVenc');
  document.getElementById('mPag').classList.add('open');
}

function editPag(id){
  const p=DB.pagar.find(x=>x.id===id);
  if(!p) return;
  fillObraSelects('pObra',false);
  fillFornecedorSelect('pFornecedor');
  document.getElementById('pFornecedor').value=p.fornecedorId||'';
  document.getElementById('mPagTitle').textContent='Editar lançamento';
  document.getElementById('pId').value=id;
  document.getElementById('btnDelPag').style.display='inline-flex';
  document.getElementById('pCat').value=p.cat;
  document.getElementById('pDesc').value=p.desc||'';
  document.getElementById('pObra').value=p.obraId||'';
  document.getElementById('pVenc').value=p.venc||'';
  document.getElementById('pValor').value=p.valor||'';
  document.getElementById('pPago').value=p.pago||'';
  document.getElementById('pStatus').value=p.status;
  document.getElementById('pNF').value=p.nf||'';
  document.getElementById('pForma').value=p.forma||'Dinheiro';
  document.getElementById('pTemRoyalties').checked=false;
  onPagCatChange(); // esconde a caixa de royalties automaticamente (edição)
  onPagStatusChange();
  onPagFormaChange();
  if(p.forma!=='Cheque'&&p.forma!=='Permuta') document.getElementById('pConta').value=p.contaId||'';
  syncDateButton('pVenc');
  document.getElementById('mPag').classList.add('open');
}

async function savePag(){
  const valor=n(document.getElementById('pValor').value);
  if(!valor){ toast('Informe o valor.', true); return; }
  const cat=document.getElementById('pCat').value;
  const isObra=isObraCat(cat);
  const obraId=isObra?document.getElementById('pObra').value:'';
  if(isObra&&!obraId){ toast('Selecione a obra para este custo.', true); return; }
  const id=document.getElementById('pId').value||uid();
  const isNew=!document.getElementById('pId').value;
  const fornecedorId=document.getElementById('pFornecedor').value;
  const status=document.getElementById('pStatus').value;
  const pago=n(document.getElementById('pPago').value);
  const forma=document.getElementById('pForma').value;
  const existente=DB.pagar.find(x=>x.id===id);

  let chequeEscolhidoId='', permutaEscolhidaId='';
  if(status==='Pago'&&pago>0){
    if(forma==='Cheque'){
      chequeEscolhidoId=document.getElementById('pChequeSel').value;
      if(!chequeEscolhidoId){ toast('Selecione o cheque a repassar.', true); return; }
    } else if(forma==='Permuta'){
      permutaEscolhidaId=document.getElementById('pPermSel').value;
      if(!permutaEscolhidaId){ toast('Selecione a permuta a usar.', true); return; }
    } else if(!document.getElementById('pConta').value){
      toast('Selecione a conta de saída do pagamento.', true); return;
    }
  }

  const p={ id, cat, desc:document.getElementById('pDesc').value, obraId,
    fornecedorId: fornecedorId&&fornecedorId!=='__novo__' ? fornecedorId : '',
    venc:document.getElementById('pVenc').value, valor,
    pago, status,
    nf:document.getElementById('pNF').value,
    forma: status==='Pago' ? forma : (existente?.forma||''),
    contaId: (status==='Pago'&&forma!=='Cheque'&&forma!=='Permuta') ? document.getElementById('pConta').value : (existente?.contaId||'') };
  const idx=DB.pagar.findIndex(x=>x.id===id);
  if(idx>=0) DB.pagar[idx]=p; else DB.pagar.push(p);

  // Ao pagar com cheque/permuta, marca o instrumento como consumido —
  // só na primeira vez (evita re-consumir em edições futuras do lançamento).
  if(status==='Pago'&&pago>0){
    if(forma==='Cheque'&&chequeEscolhidoId){
      const ch=(DB.cheques||[]).find(c=>c.id===chequeEscolhidoId);
      if(ch && ch.status!=='Repassado'){ ch.status='Repassado'; ch.pagarId=id; }
    }
    if(forma==='Permuta'&&permutaEscolhidaId){
      const pm=(DB.permutas||[]).find(x=>x.id===permutaEscolhidaId);
      if(pm && pm.status!=='Usada'){ pm.status='Usada'; pm.pagarId=id; }
    }
  }

  // Se a caixa "Esta conta tem Royalties?" estiver marcada, cria o
  // lançamento de royalties automaticamente, vinculado à mesma obra.
  if(isNew && document.getElementById('pTemRoyalties').checked){
    const royVal=n(document.getElementById('royAjuste').value);
    if(royVal>0){
      DB.pagar.push({ id:uid(), cat:'Royalties', desc:`Royalties — ${DB.obras.find(o=>o.id===obraId)?.cliente||''}`,
        obraId, venc:p.venc, valor:royVal, pago:0, status:'Pendente', nf:'' });
    }
  }
  save(); closeModal('mPag'); renderPag(); renderDash();
}

async function deletePag(){
  const id=document.getElementById('pId').value;
  if(!id) return;
  if(!(await confirmarAcao('Excluir este lançamento? Esta ação não pode ser desfeita.'))) return;
  DB.pagar=DB.pagar.filter(p=>p.id!==id);
  save(); closeModal('mPag'); renderPag(); renderDash();
  toast('Lançamento excluído.');
}

// ═══════════════════════════════════════════════════
// DRE
// ═══════════════════════════════════════════════════
function renderDRE(){
  const sel=document.getElementById('drePer');
  const cur=sel.value;
  sel.innerHTML='<option value="all">Acumulado geral</option>';
  getMeses().forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=fmtMes(m); if(m===cur)o.selected=true; sel.appendChild(o); });
  if(sel.__syncSelBtn) sel.__syncSelBtn();
  const mes=sel.value;

  // Receita em regime de caixa: soma o que foi de fato recebido dos clientes
  // (entradas, parcelas, saldos em "A Receber"), e não o valor "cheio" do
  // contrato das obras entregues. Mantém a DRE consistente com o Dashboard
  // e com o DRE por Obra, que já usam DB.receber.rec como base de receita.
  const fat=DB.receber.filter(r=>mes==='all'||(r.venc||'').startsWith(mes)).reduce((s,r)=>s+n(r.rec),0);

  // Custos diretos por categoria (lançados em A Pagar, vinculados a obras)
  const custosMap={};
  DB.pagar.filter(p=>p.obraId&&isObraCat(p.cat)&&(mes==='all'||DB.obras.find(o=>o.id===p.obraId&&o.status==='Entregue'&&(mes==='all'||o.dtE?.startsWith(mes)))))
    .forEach(p=>{ custosMap[p.cat]=(custosMap[p.cat]||0)+n(p.valor); });

  const totalCPV=Object.values(custosMap).reduce((s,v)=>s+v,0);
  const mgBruta=fat-totalCPV;

  const despMult=mes==='all'?Math.max(getMeses().length,1):1;
  const despFixed=totalDesp()*despMult;
  const despOp=DB.pagar.filter(p=>!p.obraId&&!isObraCat(p.cat)&&(mes==='all'||(p.venc||'').startsWith(mes))).reduce((s,p)=>s+n(p.valor),0);
  const totalDesp2=despFixed+despOp;
  const ebitda=mgBruta-totalDesp2;
  const resultado=ebitda;

  const pct=v=>fat>0?PCT(v/fat*100):'—';
  const row=(lbl,val,cls='',sub=false,bold=false)=>
    `<tr class="${cls}"><td ${sub?'data-csp-style="padding-left:28px;color:var(--tm);font-size:12px"':''}>${bold?`<strong>${lbl}</strong>`:lbl}</td><td class="dv">${BRL(val)}</td><td class="dp">${pct(val)}</td></tr>`;

  let html=`
    <tr class="dsec"><td colspan="3">1. RECEITA BRUTA</td></tr>
    ${row('Valores recebidos de clientes no período',fat,'',false,true)}
    <tr class="dtot"><td><strong>TOTAL RECEITA</strong></td><td class="dv">${BRL(fat)}</td><td class="dp">100%</td></tr>
    <tr class="dsec"><td colspan="3">2. CUSTOS DIRETOS DAS OBRAS (lançados em A Pagar — inclui royalties e comissão)</td></tr>
    ${Object.entries(custosMap).filter(([,v])=>v>0).map(([l,v])=>row(l,v,'',true)).join('')}
    <tr class="dtot"><td><strong>TOTAL CUSTOS DIRETOS (CPV)</strong></td><td class="dv">${BRL(totalCPV)}</td><td class="dp">${pct(totalCPV)}</td></tr>
    <tr class="dres"><td><strong>MARGEM BRUTA</strong></td><td class="dv">${BRL(mgBruta)}</td><td class="dp">${pct(mgBruta)}</td></tr>
    <tr class="dsec"><td colspan="3">3. DESPESAS OPERACIONAIS</td></tr>
    ${Object.entries(DESP_LBL).filter(([k])=>n(DB.despesas[k])>0).map(([k,l])=>row(l,n(DB.despesas[k])*despMult,'',true)).join('')}
    ${(DB.despesasExtras||[]).filter(x=>n(x.valor)>0).map(x=>row(x.nome||'(sem nome)',n(x.valor)*despMult,'',true)).join('')}
    ${despOp>0?row('Despesas variáveis lançadas',despOp,'',true):''}
    <tr class="dtot"><td><strong>TOTAL DESPESAS OPERACIONAIS</strong></td><td class="dv">${BRL(totalDesp2)}</td><td class="dp">${pct(totalDesp2)}</td></tr>
    <tr data-csp-style="background:${resultado>=0?'#D1FAE5':'#FEE2E2'}">
      <td data-csp-style="padding:12px 14px;font-weight:700;font-size:15px;color:${resultado>=0?'#065F46':'var(--red)'}">
        ${resultado>=0?'✅':'❌'} RESULTADO LÍQUIDO
      </td>
      <td class="dv" data-csp-style="font-weight:700;font-size:15px;color:${resultado>=0?'#065F46':'var(--red)'}">${BRL(resultado)}</td>
      <td class="dp" data-csp-style="color:${resultado>=0?'#065F46':'var(--red)'}">${pct(resultado)}</td>
    </tr>
  `;
  document.getElementById('tbDRE').innerHTML=html;

  // Composição de custos e despesas — % sobre o total gasto (CPV + Despesas Operacionais),
  // e não sobre a receita. Ajuda a enxergar o peso relativo de cada grupo dentro do que
  // foi efetivamente gasto no período, complementando o % sobre receita já usado na tabela.
  const totalGastos=totalCPV+totalDesp2;
  const pctCPVGasto=totalGastos>0?(totalCPV/totalGastos*100):0;
  const pctDespGasto=totalGastos>0?(totalDesp2/totalGastos*100):0;
  const barra=(lbl,val,pctVal,cor)=>`
    <div data-csp-style="margin-bottom:14px">
      <div data-csp-style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
        <span>${lbl}</span>
        <span><strong>${totalGastos>0?PCT(pctVal):'—'}</strong> &nbsp;<span data-csp-style="color:var(--tm)">(${BRL(val)})</span></span>
      </div>
      <div data-csp-style="height:10px;border-radius:6px;background:var(--gp);overflow:hidden">
        <div data-csp-style="height:100%;width:${pctVal}%;background:${cor}"></div>
      </div>
    </div>`;
  document.getElementById('dreComposicao').innerHTML=
    barra('Custos diretos das obras (CPV)',totalCPV,pctCPVGasto,'#EE6B1B')+
    barra('Despesas operacionais',totalDesp2,pctDespGasto,'#2A5EA9')+
    (totalGastos<=0?'<p data-csp-style="color:var(--tm);font-size:12px;margin-top:2px">Nenhum custo ou despesa lançado neste período.</p>':'');

  // Cascata
  killChart('cCascata');
  const ctx=document.getElementById('cCascata').getContext('2d');
  const vals=[fat,totalCPV,mgBruta,totalDesp2,resultado];
  const lbls=['Receita','(-) Custos obras','Margem Bruta','(-) Despesas Op.','Resultado Líquido'];
  const cols=['#638854','#EE6B1B','#2A5EA9','#EE6B1B',resultado>=0?'#15803D':'#C0392B'];
  charts.cCascata=new Chart(ctx,{type:'bar',data:{labels:lbls,datasets:[{data:vals,backgroundColor:cols,borderRadius:6}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>BRL(c.raw)}}},
    scales:{y:{ticks:{callback:v=>'R$'+v.toLocaleString('pt-BR',{notation:'compact'}),font:{size:10}}}}}});
}

// ═══════════════════════════════════════════════════
// DRE — abas Loja / Por Obra
// ═══════════════════════════════════════════════════
function renderDRESection(){
  renderDRE();
  renderDREObra();
}

function switchDreTab(tab){
  document.getElementById('dreTab_loja').classList.toggle('active', tab==='loja');
  document.getElementById('dreTab_obra').classList.toggle('active', tab==='obra');
  document.getElementById('dreContent_loja').classList.toggle('active', tab==='loja');
  document.getElementById('dreContent_obra').classList.toggle('active', tab==='obra');
  if(tab==='obra') renderDREObra(); else renderDRE();
}

// Navega da tela de Obras direto para o resultado individual daquela obra
function verResultadoObra(id){
  show('dre', navLinks[4]);
  switchDreTab('obra');
  document.getElementById('dreObraSel').value = id;
  renderDREObra();
}

// Meses em que há lançamentos (custos ou recebimentos) vinculados a uma obra específica
function getMesesObra(obraId){
  const ms = new Set();
  DB.pagar.filter(p=>p.obraId===obraId).forEach(p=>{ if(p.venc) ms.add(p.venc.slice(0,7)); });
  DB.receber.filter(r=>r.obraId===obraId).forEach(r=>{ if(r.venc) ms.add(r.venc.slice(0,7)); });
  return [...ms].sort();
}

function renderDREObra(){
  const sel = document.getElementById('dreObraSel');
  const curObra = sel.value;
  sel.innerHTML = '';
  [...DB.obras].sort((a,b)=>(b.dtC||'')>(a.dtC||'')?1:-1).forEach(o=>{
    const opt=document.createElement('option');
    opt.value=o.id;
    opt.textContent=`${o.cliente} — ${o.modelo} (${o.status})`;
    if(o.id===curObra) opt.selected=true;
    sel.appendChild(opt);
  });
  const box = document.getElementById('dreObraBox');
  if(!DB.obras.length){
    sel.innerHTML='<option value="">Nenhuma obra cadastrada</option>';
    document.getElementById('dreObraPer').innerHTML='<option value="all">Acumulado (todo o período)</option>';
    if(sel.__syncSelBtn) sel.__syncSelBtn();
    const dreObraPerEl=document.getElementById('dreObraPer');
    if(dreObraPerEl.__syncSelBtn) dreObraPerEl.__syncSelBtn();
    box.innerHTML='<div class="empty"><div class="ei">🏗️</div><h3>Nenhuma obra cadastrada</h3><p>Cadastre uma obra para ver seu resultado individual</p></div>';
    return;
  }
  if(!sel.value) sel.value = DB.obras[0].id;
  if(sel.__syncSelBtn) sel.__syncSelBtn();
  const obraId = sel.value;
  const o = DB.obras.find(x=>x.id===obraId);

  // Período (meses com lançamento para esta obra)
  const perSel = document.getElementById('dreObraPer');
  const curPer = perSel.value;
  perSel.innerHTML = '<option value="all">Acumulado (todo o período)</option>';
  getMesesObra(obraId).forEach(m=>{
    const op=document.createElement('option'); op.value=m; op.textContent=fmtMes(m);
    if(m===curPer) op.selected=true; perSel.appendChild(op);
  });
  if(perSel.__syncSelBtn) perSel.__syncSelBtn();
  const mes = perSel.value;

  const emAndamento = o.status !== 'Entregue';

  // Totais acumulados (resultado real da obra até hoje, independente do período selecionado)
  const c = calcObra(o);
  const recebido = DB.receber.filter(r=>r.obraId===obraId).reduce((s,r)=>s+n(r.rec),0);
  const previsto = DB.receber.filter(r=>r.obraId===obraId).reduce((s,r)=>s+n(r.prev),0);
  const saldoReceber = previsto - recebido;

  // Custos lançados no período selecionado (para inspecionar mês a mês)
  const custosMap = {};
  DB.pagar.filter(p=>p.obraId===obraId && isObraCat(p.cat) && p.cat!=='Royalties' && p.cat!=='Comissão' && (mes==='all'||(p.venc||'').startsWith(mes)))
    .forEach(p=>{ custosMap[p.cat]=(custosMap[p.cat]||0)+n(p.valor); });
  const custosPeriodo = Object.values(custosMap).reduce((s,v)=>s+v,0);
  const royaltiesPeriodo = DB.pagar.filter(p=>p.obraId===obraId && p.cat==='Royalties' && (mes==='all'||(p.venc||'').startsWith(mes))).reduce((s,p)=>s+n(p.valor),0);
  const comissaoPeriodo = DB.pagar.filter(p=>p.obraId===obraId && p.cat==='Comissão' && (mes==='all'||(p.venc||'').startsWith(mes))).reduce((s,p)=>s+n(p.valor),0);

  const mCls = c.margem>=35?'pos':c.margem>=20?'':'neg';

  let alertHtml='';
  if(emAndamento){
    alertHtml = `<div class="box bx-blue" data-csp-style="margin-bottom:16px"><div class="box-icon">🚧</div><div><strong>Obra em andamento (${escapeHtml(o.status)}).</strong> O resultado abaixo é parcial — pode haver custos e/ou receitas ainda não lançados no sistema.</div></div>`;
  }

  const header = `
    <div class="obra-detail">
      <div class="od-header">
        <div class="od-title">
          <h2>${escapeHtml(o.cliente)} — ${escapeHtml(o.modelo)}</h2>
          <p>${sbadge(o.status)} &nbsp; ${o.cidade?escapeHtml(o.cidade)+' · ':''}${o.dtC?'Contrato em '+fmtDate(o.dtC):''}${o.dtE?' · Entregue em '+fmtDate(o.dtE):''}</p>
        </div>
        <button class="btn bs bsm" data-fin-dynamic-call="editObra" data-fin-dynamic-id="${escapeAttr(o.id)}">Editar obra</button>
      </div>
      ${alertHtml}
      <div class="od-kpis">
        <div class="od-kpi"><div class="lbl">Venda contratada</div><div class="val">${BRL(c.venda)}</div></div>
        <div class="od-kpi"><div class="lbl">Custos lançados (total)</div><div class="val">${BRL(c.custos)}</div></div>
        <div class="od-kpi"><div class="lbl">Resultado acumulado</div><div class="val" data-csp-style="color:${c.resultado>=0?'#15803D':'var(--red)'}">${BRL(c.resultado)}</div></div>
        <div class="od-kpi"><div class="lbl">Margem</div><div class="val ${mCls}">${PCT(c.margem)}</div></div>
      </div>
    </div>
  `;

  const pct = v => c.venda>0 ? PCT(v/c.venda*100) : '—';
  const row=(lbl,val,sub=false,bold=false)=>
    `<tr><td ${sub?'data-csp-style="padding-left:28px;color:var(--tm);font-size:12px"':''}>${bold?`<strong>${lbl}</strong>`:lbl}</td><td class="dv">${BRL(val)}</td><td class="dp">${pct(val)}</td></tr>`;

  const tableHtml = `
    <tr class="dsec"><td colspan="3">1. RECEITA DA OBRA (VALOR CONTRATADO)</td></tr>
    ${row('Valor total da venda',c.venda,false,true)}
    ${row('Recebido até o momento',recebido,true)}
    ${row('Saldo a receber',saldoReceber,true)}
    <tr class="dsec"><td colspan="3">2. CUSTOS LANÇADOS ${mes==='all'?'(TODO O PERÍODO)':'EM '+fmtMes(mes).toUpperCase()}</td></tr>
    ${Object.entries(custosMap).filter(([,v])=>v>0).map(([l,v])=>row(l,v,true)).join('') || (royaltiesPeriodo<=0&&comissaoPeriodo<=0?'<tr><td data-csp-style="padding-left:28px;color:var(--tm);font-size:12px" colspan="3">Nenhum custo lançado neste período</td></tr>':'')}
    ${royaltiesPeriodo>0?row('Royalties',royaltiesPeriodo,true):''}
    ${comissaoPeriodo>0?row('Comissão de vendas',comissaoPeriodo,true):''}
    <tr class="dtot"><td><strong>TOTAL CUSTOS NO PERÍODO SELECIONADO</strong></td><td class="dv">${BRL(custosPeriodo+royaltiesPeriodo+comissaoPeriodo)}</td><td class="dp">${pct(custosPeriodo+royaltiesPeriodo+comissaoPeriodo)}</td></tr>
    <tr class="dsec"><td colspan="3">3. RESULTADO ACUMULADO ATÉ HOJE (TODOS OS CUSTOS LANÇADOS)</td></tr>
    ${row('Total de custos lançados (acumulado — inclui royalties e comissão em "A Pagar")',c.custos,true)}
    <tr data-csp-style="background:${c.resultado>=0?'#D1FAE5':'#FEE2E2'}">
      <td data-csp-style="padding:12px 14px;font-weight:700;font-size:15px;color:${c.resultado>=0?'#065F46':'var(--red)'}">
        ${c.resultado>=0?'✅':'❌'} RESULTADO ${emAndamento?'PARCIAL':'FINAL'} DA OBRA
      </td>
      <td class="dv" data-csp-style="font-weight:700;font-size:15px;color:${c.resultado>=0?'#065F46':'var(--red)'}">${BRL(c.resultado)}</td>
      <td class="dp" data-csp-style="color:${c.resultado>=0?'#065F46':'var(--red)'}">${pct(c.resultado)}</td>
    </tr>
  `;

  box.innerHTML = header + `<div class="card"><table class="dre">${tableHtml}</table></div>`;
}

// ═══════════════════════════════════════════════════
// DESPESAS
// ═══════════════════════════════════════════════════
function renderDesp(){
  const form=document.getElementById('despForm');
  form.innerHTML=Object.entries(DESP_LBL).map(([k,l])=>
    `<div class="fg"><label>${l}</label><input id="d_${k}" placeholder="R$ 0,00"></div>`
  ).join('');
  Object.keys(DESP_LBL).forEach(k=>{
    const el=document.getElementById('d_'+k);
    attachMoneyMask(el);
    el.value = n(DB.despesas[k]) || '';
  });
  renderDespExtras();
  const tot=totalDesp();
  const linhasFixas=Object.entries(DESP_LBL).filter(([k])=>n(DB.despesas[k])>0).map(([k,l])=>{
    const v=n(DB.despesas[k]);
    return `<tr><td>${l}</td><td class="tr mono">${BRL(v)}</td><td class="tr mono">${BRL(v*12)}</td><td class="tr">${tot>0?(v/tot*100).toFixed(1)+'%':'—'}</td></tr>`;
  }).join('');
  const linhasExtras=(DB.despesasExtras||[]).filter(x=>n(x.valor)>0).map(x=>{
    const v=n(x.valor);
    return `<tr><td>${escapeHtml(x.nome||'(sem nome)')}</td><td class="tr mono">${BRL(v)}</td><td class="tr mono">${BRL(v*12)}</td><td class="tr">${tot>0?(v/tot*100).toFixed(1)+'%':'—'}</td></tr>`;
  }).join('');
  document.getElementById('tbDesp').innerHTML=(linhasFixas+linhasExtras)||'<tr><td colspan="4" class="tc" data-csp-style="padding:20px;color:var(--tm)">Nenhuma despesa configurada</td></tr>';
  document.getElementById('despTot').textContent=BRL(tot);
  document.getElementById('despAnual').textContent=BRL(tot*12);
}

// ── Despesas fixas adicionais (lista dinâmica, nome livre) ──
function renderDespExtras(){
  const wrap=document.getElementById('despExtrasList');
  if(!DB.despesasExtras) DB.despesasExtras=[];
  if(!DB.despesasExtras.length){
    wrap.innerHTML='<p data-csp-style="color:var(--tm);font-size:13px;margin:0 0 10px">Nenhuma despesa adicional cadastrada.</p>';
    return;
  }
  wrap.innerHTML=DB.despesasExtras.map(x=>`
    <div class="fg" data-csp-style="display:flex;gap:10px;align-items:flex-end;margin-bottom:10px">
      <div data-csp-style="flex:2"><label>Nome da despesa</label><input id="dx_nome_${escapeAttr(x.id)}" placeholder="Ex: Manutenção do showroom"></div>
      <div data-csp-style="flex:1"><label>Valor mensal (R$)</label><input id="dx_valor_${escapeAttr(x.id)}" placeholder="R$ 0,00"></div>
      <button class="btn bs bsm" type="button" title="Remover despesa" data-fin-dynamic-call="removeDespesaExtra" data-fin-dynamic-id="${escapeAttr(x.id)}" data-csp-style="height:38px">🗑️</button>
    </div>
  `).join('');
  DB.despesasExtras.forEach(x=>{
    document.getElementById('dx_nome_'+x.id).value=x.nome||'';
    const vEl=document.getElementById('dx_valor_'+x.id);
    attachMoneyMask(vEl);
    vEl.value=n(x.valor)||'';
  });
}

function addDespesaExtra(){
  if(!DB.despesasExtras) DB.despesasExtras=[];
  DB.despesasExtras.push({ id:uid(), nome:'', valor:0 });
  renderDespExtras();
  const novo=DB.despesasExtras[DB.despesasExtras.length-1];
  document.getElementById('dx_nome_'+novo.id)?.focus();
}

async function removeDespesaExtra(id){
  if(!(await confirmarAcao('Remover esta despesa fixa adicional?'))) return;
  DB.despesasExtras=DB.despesasExtras.filter(x=>x.id!==id);
  save(); renderDespExtras(); renderDesp(); renderDash();
  toast('Despesa removida.');
}

function saveDespesas(){
  Object.keys(DESP_LBL).forEach(k=>{ DB.despesas[k]=n(document.getElementById('d_'+k).value); });
  (DB.despesasExtras||[]).forEach(x=>{
    const nomeEl=document.getElementById('dx_nome_'+x.id);
    const valorEl=document.getElementById('dx_valor_'+x.id);
    if(nomeEl) x.nome=nomeEl.value.trim();
    if(valorEl) x.valor=n(valorEl.value);
  });
  // Remove linhas adicionadas e deixadas em branco (sem nome e sem valor)
  DB.despesasExtras=(DB.despesasExtras||[]).filter(x=>x.nome||n(x.valor)>0);
  save(); renderDesp(); renderDash();
  const a=document.createElement('div');
  a.className='box bx-green'; a.innerHTML='<div class="box-icon">✅</div><div>Despesas salvas com sucesso.</div>';
  document.querySelector('#despesas .fsec:last-of-type').appendChild(a);
  setTimeout(()=>a.remove(),2500);
}

// ═══════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════
function renderConfig(){
  document.getElementById('cfgNome').value=DB.config.nome||'';
  document.getElementById('cfgResp').value=DB.config.resp||'';
  document.getElementById('cfgRoy').value=DB.config.royalties||5;
  document.getElementById('cfgCom').value=DB.config.comissao||3;
  document.getElementById('cfgMkt').value=DB.config.marketing||0;
  document.getElementById('cfgLimitePermuta').value=DB.config.limitePermuta||'';
}
function saveConfig(){
  DB.config.nome=document.getElementById('cfgNome').value;
  DB.config.resp=document.getElementById('cfgResp').value;
  DB.config.royalties=n(document.getElementById('cfgRoy').value);
  DB.config.comissao=n(document.getElementById('cfgCom').value);
  DB.config.marketing=n(document.getElementById('cfgMkt').value);
  DB.config.limitePermuta=n(document.getElementById('cfgLimitePermuta').value);
  save();
  document.getElementById('hLoja').textContent=DB.config.nome||'Minha Loja';
  renderDash();
  toast('Configurações salvas com sucesso.');
}

// ═══════════════════════════════════════════════════
// MODALS / UTILS
// ═══════════════════════════════════════════════════
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.mb').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('open'); }));

function badges(){
  document.getElementById('bObras').textContent=DB.obras.length;
  document.getElementById('bRec').textContent=DB.receber.filter(r=>r.status!=='Recebido').length;
  document.getElementById('bPag').textContent=DB.pagar.filter(p=>p.status!=='Pago').length;
  document.getElementById('bForn').textContent=(DB.fornecedores||[]).length;
}

// ═══════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════
async function loadDemo(){
  if(!(await confirmarAcao('Carregar dados de demonstração? Os dados atuais serão substituídos.', { textoBotao:'Carregar demo', destrutivo:true }))) return;
  const hoje=new Date(); const d=(m,dd)=>{ const dt=new Date(hoje); dt.setMonth(dt.getMonth()+m); return dt.toISOString().slice(0,7)+'-'+String(dd).padStart(2,'0'); };
  DB.config={nome:'321 Modular | Florianópolis',resp:'João Franqueado',royalties:5,comissao:3,marketing:0};
  DB.despesas={aluguel:2800,salarios:5300,encargos:0,contabilidade:600,impostos:350,energia:300,agua:80,internet:180,assinaturas:120,marketing_local:300,outras:150};

  const o1=uid(),o2=uid(),o3=uid(),o4=uid(),o5=uid(),o6=uid();
  DB.obras=[
    {id:o1,cliente:'Ricardo Mendonça',modelo:'Chalé 40m²',dtC:d(-5,8),dtE:d(-4,25),status:'Entregue',cidade:'Florianópolis',venda:95000,fPag:'30% entrada + 6x cartão',obs:'Airbnb em área turística'},
    {id:o2,cliente:'Grupo Turismo Serra',modelo:'Chalé Duplex 60m²',dtC:d(-4,5),dtE:d(-2,3),status:'Entregue',cidade:'Gramado',venda:138000,fPag:'40% entrada + 8x cartão',obs:'Empresa — pousada'},
    {id:o3,cliente:'Marina Souza',modelo:'Chalé 40m²',dtC:d(-4,18),dtE:d(-2,20),status:'Entregue',cidade:'Biguaçu',venda:92000,fPag:'Entrada + permuta moto + 6x',obs:'Permuta moto Honda'},
    {id:o4,cliente:'Fazenda Verde LTDA',modelo:'Chalé 40m² + Deck',dtC:d(-3,15),dtE:d(-1,28),status:'Entregue',cidade:'Lages',venda:108000,fPag:'40% + 6x cartão',obs:'Deck adicional 20m²'},
    {id:o5,cliente:'Família Rodrigues',modelo:'Chalé 40m²',dtC:d(-2,5),dtE:d(1,10),status:'Em montagem',cidade:'São José',venda:88000,fPag:'30% + 6x',obs:''},
    {id:o6,cliente:'Paulo Drummond',modelo:'Chalé 40m²',dtC:d(-1,28),dtE:d(2,15),status:'Em produção',cidade:'Palhoça',venda:96000,fPag:'30% + 8x',obs:'Kit fábrica pago'},
  ];

  // A Receber (gerados ao salvar obra, aqui simulamos)
  DB.receber=[
    {id:uid(),obraId:o1,tipo:'Entrada',desc:'Entrada 30%',venc:d(-5,8),prev:28500,rec:28500,status:'Recebido',obs:'PIX'},
    {id:uid(),obraId:o1,tipo:'Parcela',desc:'Parcela 1/6',venc:d(-4,8),prev:11083,rec:11083,status:'Recebido',obs:'Cartão'},
    {id:uid(),obraId:o1,tipo:'Parcela',desc:'Parcela 2/6',venc:d(-3,8),prev:11083,rec:11083,status:'Recebido',obs:'Cartão'},
    {id:uid(),obraId:o1,tipo:'Parcela',desc:'Parcela 3/6',venc:d(-2,8),prev:11083,rec:11083,status:'Recebido',obs:'Cartão'},
    {id:uid(),obraId:o1,tipo:'Parcela',desc:'Parcela 4/6',venc:d(-1,8),prev:11083,rec:11083,status:'Recebido',obs:'Cartão'},
    {id:uid(),obraId:o1,tipo:'Parcela',desc:'Parcela 5/6',venc:d(0,8),prev:11083,rec:0,status:'Pendente',obs:'Cartão'},
    {id:uid(),obraId:o1,tipo:'Parcela',desc:'Parcela 6/6',venc:d(1,8),prev:11085,rec:0,status:'Pendente',obs:'Cartão'},
    {id:uid(),obraId:o2,tipo:'Entrada',desc:'Entrada 40%',venc:d(-4,5),prev:55200,rec:55200,status:'Recebido',obs:'TED'},
    {id:uid(),obraId:o2,tipo:'Parcela',desc:'Parcelas 1-4/8',venc:d(-1,5),prev:41400,rec:41400,status:'Recebido',obs:'Cartão'},
    {id:uid(),obraId:o2,tipo:'Parcela',desc:'Parcelas 5-8/8',venc:d(3,5),prev:41400,rec:0,status:'Pendente',obs:'Cartão'},
    {id:uid(),obraId:o3,tipo:'Entrada',desc:'Entrada',venc:d(-4,18),prev:18400,rec:18400,status:'Recebido',obs:'PIX'},
    {id:uid(),obraId:o3,tipo:'Permuta',desc:'Permuta — Moto Honda CBR',venc:d(-4,18),prev:19000,rec:19000,status:'Recebido',obs:'Avaliada e aceita'},
    {id:uid(),obraId:o3,tipo:'Parcela',desc:'Parcelas 1-3/6',venc:d(-2,18),prev:27300,rec:27300,status:'Recebido',obs:'Cartão'},
    {id:uid(),obraId:o3,tipo:'Parcela',desc:'Parcelas 4-6/6',venc:d(1,18),prev:27300,rec:0,status:'Pendente',obs:'Cartão'},
    {id:uid(),obraId:o4,tipo:'Entrada',desc:'Entrada 40%',venc:d(-3,15),prev:43200,rec:43200,status:'Recebido',obs:'TED empresa'},
    {id:uid(),obraId:o4,tipo:'Parcela',desc:'Parcelas 1-3/6',venc:d(-1,15),prev:32400,rec:0,status:'Em atraso',obs:'Verificar cartão'},
    {id:uid(),obraId:o4,tipo:'Parcela',desc:'Parcelas 4-6/6',venc:d(2,15),prev:32400,rec:0,status:'Pendente',obs:'Cartão'},
    {id:uid(),obraId:o5,tipo:'Entrada',desc:'Entrada 30%',venc:d(-2,5),prev:26400,rec:26400,status:'Recebido',obs:'PIX'},
    {id:uid(),obraId:o5,tipo:'Parcela',desc:'Parcelas 1-6/6',venc:d(2,5),prev:61600,rec:0,status:'Pendente',obs:'Após entrega'},
    {id:uid(),obraId:o6,tipo:'Entrada',desc:'Entrada 30%',venc:d(-1,28),prev:28800,rec:28800,status:'Recebido',obs:'TED'},
    {id:uid(),obraId:o6,tipo:'Parcela',desc:'Parcelas 1-8/8',venc:d(3,28),prev:67200,rec:0,status:'Pendente',obs:'Após entrega'},
  ];

  // A Pagar — custos de obra vinculados + operacional
  DB.pagar=[
    // Obra 1
    {id:uid(),cat:'Kit Fábrica',desc:'321 Fábrica — Kit Chalé 40m²',obraId:o1,venc:d(-5,20),valor:38000,pago:38000,status:'Pago',nf:'NF 4521'},
    {id:uid(),cat:'Royalties',desc:'Royalties — Ricardo Mendonça',obraId:o1,venc:d(-5,20),valor:1900,pago:1900,status:'Pago',nf:''},
    {id:uid(),cat:'Telhas',desc:'Telhas cerâmicas',obraId:o1,venc:d(-4,20),valor:3200,pago:3200,status:'Pago',nf:'NF 8812'},
    {id:uid(),cat:'Frete',desc:'Transportadora Rápida',obraId:o1,venc:d(-4,25),valor:1800,pago:1800,status:'Pago',nf:'CT-e 991'},
    {id:uid(),cat:'Mão de obra montagem',desc:'Equipe montagem — 5 dias',obraId:o1,venc:d(-4,25),valor:4500,pago:4500,status:'Pago',nf:'RPA'},
    {id:uid(),cat:'Alicerce / Blocos',desc:'Blocos e argamassa',obraId:o1,venc:d(-4,22),valor:1200,pago:1200,status:'Pago',nf:'NF 2201'},
    // Obra 2
    {id:uid(),cat:'Kit Fábrica',desc:'321 Fábrica — Kit Duplex 60m²',obraId:o2,venc:d(-4,20),valor:55000,pago:55000,status:'Pago',nf:'NF 4631'},
    {id:uid(),cat:'Royalties',desc:'Royalties — Grupo Turismo Serra',obraId:o2,venc:d(-4,20),valor:2750,pago:2750,status:'Pago',nf:''},
    {id:uid(),cat:'Frete',desc:'Frete especial duplo',obraId:o2,venc:d(-2,3),valor:2600,pago:2600,status:'Pago',nf:'CT-e 1210'},
    {id:uid(),cat:'Mão de obra montagem',desc:'Equipe montagem — 7 dias',obraId:o2,venc:d(-2,5),valor:6800,pago:6800,status:'Pago',nf:'RPA'},
    {id:uid(),cat:'Telhas',desc:'Telhas',obraId:o2,venc:d(-3,25),valor:4800,pago:4800,status:'Pago',nf:'NF 8900'},
    // Obra 3
    {id:uid(),cat:'Kit Fábrica',desc:'321 Fábrica — Kit Chalé 40m²',obraId:o3,venc:d(-4,1),valor:37000,pago:37000,status:'Pago',nf:'NF 4702'},
    {id:uid(),cat:'Royalties',desc:'Royalties — Marina Souza',obraId:o3,venc:d(-4,1),valor:1850,pago:1850,status:'Pago',nf:''},
    {id:uid(),cat:'Telhas',desc:'Telhas',obraId:o3,venc:d(-3,20),valor:3100,pago:3100,status:'Pago',nf:'NF 8991'},
    // Obra 4
    {id:uid(),cat:'Kit Fábrica',desc:'321 Fábrica — Kit 40m² + Deck',obraId:o4,venc:d(-3,1),valor:43000,pago:43000,status:'Pago',nf:'NF 4801'},
    {id:uid(),cat:'Royalties',desc:'Royalties — Fazenda Verde',obraId:o4,venc:d(-3,1),valor:2150,pago:2150,status:'Pago',nf:''},
    {id:uid(),cat:'Mão de obra montagem',desc:'Equipe + pintura',obraId:o4,venc:d(-1,28),valor:7000,pago:7000,status:'Pago',nf:'RPA'},
    // Obra 5 — pendentes
    {id:uid(),cat:'Kit Fábrica',desc:'321 Fábrica — Kit Chalé 40m²',obraId:o5,venc:d(-2,20),valor:35500,pago:35500,status:'Pago',nf:'NF 4988'},
    {id:uid(),cat:'Royalties',desc:'Royalties — Família Rodrigues',obraId:o5,venc:d(-2,20),valor:1775,pago:1775,status:'Pago',nf:''},
    {id:uid(),cat:'Mão de obra montagem',desc:'Equipe montagem — pendente conclusão',obraId:o5,venc:d(1,10),valor:4100,pago:0,status:'Pendente',nf:''},
    // Obra 6 — só kit pago
    {id:uid(),cat:'Kit Fábrica',desc:'321 Fábrica — Kit Chalé 40m²',obraId:o6,venc:d(-1,28),valor:38500,pago:38500,status:'Pago',nf:'NF 5021'},
    {id:uid(),cat:'Royalties',desc:'Royalties — Paulo Drummond',obraId:o6,venc:d(-1,28),valor:1925,pago:1925,status:'Pago',nf:''},
    // Operacional (sem obra)
    {id:uid(),cat:'Aluguel',desc:'Aluguel showroom',obraId:'',venc:d(0,5),valor:2800,pago:0,status:'Pendente',nf:''},
    {id:uid(),cat:'Salários',desc:'Salários + pró-labore',obraId:'',venc:d(0,10),valor:5300,pago:0,status:'Pendente',nf:''},
    {id:uid(),cat:'Contabilidade',desc:'Escritório ABC Contabilidade',obraId:'',venc:d(0,15),valor:600,pago:600,status:'Pago',nf:''},
  ];

  document.getElementById('hLoja').textContent=DB.config.nome;
  save().then(()=>location.reload());
}

async function clearAll(){
  const ok = await confirmarAcao(
    'Isso vai apagar PERMANENTEMENTE todas as obras, recebimentos, pagamentos, despesas e configurações desta conta. Não é possível desfazer esta ação.',
    { textoBotao:'Apagar tudo', destrutivo:true, requerTexto:'APAGAR', titulo:'🗑️ Apagar todos os dados' }
  );
  if(!ok) return;
  DB = {
    obras:[], receber:[], pagar:[],
    config:{ nome:'321 Modular | Minha Loja', resp:'', royalties:5, comissao:3, marketing:0, limitePermuta:0 },
    despesas:{ aluguel:0, salarios:0, encargos:0, contabilidade:0, impostos:0, energia:0, agua:0, internet:0, assinaturas:0, marketing_local:0, outras:0 },
    despesasExtras:[],
    fornecedores:[], contas:[],
    tiposConta:[{id:'tc_caixa',nome:'Caixa'},{id:'tc_cc',nome:'Conta Corrente'},{id:'tc_poup',nome:'Poupança'}],
    cheques:[], permutas:[]
  };
  await save();
  location.reload();
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
function startApp(){
  document.getElementById('hLoja').textContent=DB.config.nome||'Minha Loja';
  ['oModelo','oStatus','oTipoEnt','rObra','rTipo','rStatus','pCat','pObra','pStatus','dashPer','drePer','dreObraSel','dreObraPer','custosModo','custosFiltro'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) enhanceSelect(el);
  });
  attachMoneyMasks(['oVenda','oEnt','oParc','oPerm','oSaldo','rPrev','rRec','pValor','pPago','royAjuste']);
  badges();
  renderDash();
}

// Financeiro: aplica estilos dinâmicos permitidos sem atributos style inline no HTML.
(function wireFinanceiroDynamicStyles() {
  const allowedProperties = new Set([
    'padding', 'font-size', 'font-weight', 'color', 'text-transform', 'letter-spacing',
    'margin-right', 'display', 'gap', 'border-top', 'margin-top', 'background',
    'white-space', 'padding-left', 'margin-bottom', 'justify-content', 'border-radius',
    'overflow', 'height', 'width', 'flex', 'margin', 'background-color', 'align-items'
  ]);

  function safeValue(value) {
    return value.length <= 220
      && !/["'`]|url\s*\(|expression\s*\(|javascript\s*:|data\s*:/i.test(value)
      && /^[#%().,:;+\-*/\w\s]+$/.test(value);
  }

  function applyNode(node) {
    if (!(node instanceof Element)) return;
    const source = node.getAttribute('data-csp-style');
    if (!source) return;

    source.split(';').forEach((declaration) => {
      const separator = declaration.indexOf(':');
      if (separator < 1) return;
      const property = declaration.slice(0, separator).trim().toLowerCase();
      const value = declaration.slice(separator + 1).trim();
      if (!allowedProperties.has(property) || !safeValue(value)) return;
      node.style.setProperty(property, value);
    });
  }

  function applyStyles(root = document) {
    applyNode(root);
    root.querySelectorAll?.('[data-csp-style]').forEach(applyNode);
  }

  applyStyles();
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => applyStyles(node)));
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
})();
initCalendarios();
window.addEventListener('superapp:authorized', async () => {
  try {
    await loadCentralFinanceSession();
  } catch (error) {
    window.SuperAppAuth.logAuthFailure?.(error, 'financeiro-load');
    showFinanceLoadFailure(window.SuperAppAuth.getSafeAuthMessage(error, 'Não foi possível carregar o ambiente financeiro. Tente novamente.'));
  } finally {
    window.SuperAppAuth.releaseAppGuard?.();
  }
}, { once: true });
// Financeiro: eventos delegados para compatibilidade com CSP sem handlers inline.
(function wireFinanceiroDelegatedEvents() {
  function callFinanceiro(name, element) {
    const fn = window[name];
    if (typeof fn === 'function') return fn.call(element);
  }

  function callFinanceiroDynamic(element) {
    const fn = window[element.dataset.finDynamicCall];
    if (typeof fn !== 'function') return;
    const id = element.dataset.finDynamicId;
    if (element.dataset.finDynamicValue === 'current') return fn.call(element, id, element.value);
    return fn.call(element, id);
  }

  document.addEventListener('click', (event) => {
    const element = event.target.closest?.(
      '[data-fin-call],[data-fin-dynamic-call],[data-fin-close-modal],[data-fin-show],[data-fin-filter-pag],[data-fin-switch-fc],[data-fin-switch-dre]'
    );
    if (!element) return;

    event.preventDefault();

    if (element.dataset.finCloseModal) {
      if (typeof closeModal === 'function') closeModal(element.dataset.finCloseModal);
      return;
    }

    if (element.dataset.finShow) {
      const navIndex = element.dataset.finNavIndex;
      const target = navIndex == null ? element : navLinks[Number(navIndex)];
      if (typeof show === 'function') show(element.dataset.finShow, target || element);
      return;
    }

    if (element.dataset.finFilterPag) {
      if (typeof filterPag === 'function') filterPag(element.dataset.finFilterPag, element);
      return;
    }

    if (element.dataset.finSwitchFc) {
      if (typeof switchFcTab === 'function') switchFcTab(element.dataset.finSwitchFc);
      return;
    }

    if (element.dataset.finSwitchDre) {
      if (typeof switchDreTab === 'function') switchDreTab(element.dataset.finSwitchDre);
      return;
    }

    if (element.dataset.finDynamicCall) {
      callFinanceiroDynamic(element);
      return;
    }

    callFinanceiro(element.dataset.finCall, element);
  });

  document.addEventListener('change', (event) => {
    const element = event.target.closest?.('[data-fin-supplier-new],[data-fin-change-call],[data-fin-dynamic-call]');
    if (!element) return;

    if (element.dataset.finSupplierNew) {
      if (element.value === '__novo__') {
        element.value = '';
        if (typeof openFornecedorModal === 'function') openFornecedorModal(null, true);
      }
      return;
    }

    if (element.dataset.finDynamicCall) {
      callFinanceiroDynamic(element);
      return;
    }

    callFinanceiro(element.dataset.finChangeCall, element);
  });

  document.addEventListener('input', (event) => {
    const element = event.target.closest?.('[data-fin-input-call]');
    if (element) callFinanceiro(element.dataset.finInputCall, element);
  });
})();