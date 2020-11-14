<?php

define('ROOT_PATH', __DIR__ . '/..');
define('PUBLIC_PATH', ROOT_PATH . '/web');
define('APP_PATH', ROOT_PATH . '/app');

require_once ROOT_PATH . '/vendor/autoload.php';

$app = new Silex\Application();

// Set to true to enable debug mode
$app['debug'] = false;

// Create asset provider to load resources from composer 
$app->register(new Silex\Provider\AssetServiceProvider());

// Register the Twig service provider and let it know where to look for templates.
$app->register(new Silex\Provider\TwigServiceProvider(), array(
  'twig.path' => APP_PATH . '/views',
));

// Create route for the root of the site. This will function as the chicago train lines page.
$app->get('/', function () use ($app) {
  
    return $app['twig']->render('pages/trainline.html.twig', [
      'title' => 'Chicago Trainlines',
    ]);
})->bind('home');

$app->run();