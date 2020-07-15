<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" value="{{ csrf_token() }}" />
    <title>My Portfolio</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet" type="text/css">
    <link href="{{ mix('css/app.css') }}" type="text/css" rel="stylesheet" />
    <style>
        html {
            overflow: auto;
        }

        ::-webkit-scrollbar {
        width: 15px;
        }

        ::-webkit-scrollbar-track {
        background: #202020;
        border-left: 1px solid #2c2c2c;
        }

        ::-webkit-scrollbar-thumb {
        background: #3e3e3e;
        border: solid 3px #202020;
        border-radius: 7px;
        }

        ::-webkit-scrollbar-thumb:hover {
        background: #c9c9c9;
        }
    </style>
</head>

<body>
    <div id="app">
    </div>
    <script src="{{ asset("js/app.js") }}" defer></script>
</body>

</html>
