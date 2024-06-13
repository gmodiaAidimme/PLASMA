<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Plasma</title>

    <link rel="stylesheet" type="text/css" href="/css/google.css">
    <link rel="stylesheet" type="text/css" href="/plugins/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="/css/ionicons.min.css">
    <link rel="stylesheet" type="text/css" href="/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
    <link rel="stylesheet" type="text/css" href="/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/dist/css/adminlte.min.css">
    <link rel="stylesheet" type="text/css" href="/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
    <link rel="stylesheet" type="text/css" href="/plugins/daterangepicker/daterangepicker.css">
    <link rel="stylesheet" type="text/css" href="/plugins/summernote/summernote-bs4.min.css">
    <link rel="stylesheet" type="text/css" href="/css/datatables.min.css">
    <link rel="stylesheet" type="text/css" href="/css/gabo.css">
    <link rel="stylesheet" type="text/css" href="/css/botonGoogle.css">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <!-- <link rel="stylesheet" type="text/css"  href="/plugins/jqvmap/jqvmap.min.css"> -->
</head>

<body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper" id="app"></div>

    <script type="text/javascript" src="/plugins/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="/plugins/jquery-ui/jquery-ui.min.js"></script>
    <script type="text/javascript">
        $.widget.bridge('uibutton', $.ui.button)
    </script>
    <script type="text/javascript" src="/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="/plugins/chart.js/Chart.min.js"></script>
    <script type="text/javascript" src="/plugins/sparklines/sparkline.js"></script>
    <script type="text/javascript" src="/plugins/jquery-knob/jquery.knob.min.js"></script>
    <script type="text/javascript" src="/plugins/moment/moment.min.js"></script>
    <script type="text/javascript" src="/plugins/daterangepicker/daterangepicker.js"></script>
    <script type="text/javascript" src="/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
    <script type="text/javascript" src="/plugins/summernote/summernote-bs4.min.js"></script>
    <script type="text/javascript" src="/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
    <script type="text/javascript" src="/dist/js/adminlte.js"></script>
    <script type="text/javascript" src="/js/datatables.min.js"></script>

    <script type="text/javascript">
        var csrf_token = "<?php echo (csrf_token()) ?>"
    </script>
    <script src='/js/app.js'></script>
</body>

</html>