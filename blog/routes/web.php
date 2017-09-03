<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/',[
  'uses' => 'PostController@getIndex',
  'as' => 'blog.index'
]);

Route::get('post/{id}/like',[
  'uses' => 'PostController@getPost',
  'as' => 'blog.post'
]);

Route::get('post/{id}',[
  'uses' => 'PostController@getLikePost',
  'as' => 'blog.post.like'
]);

Route::get('about', function() {
    return View('other.about');
})->name('other.about');

Route::group(['prefix' => 'admin', 'middleware' => 'auth'],
   function() {
      Route::get('',[
        'uses' => 'PostController@getAdminIndex',
        'as' => 'admin.index'

      ]);

      Route::get('create',[
        'uses' => 'PostController@getAdminCreate',
        'as' => 'admin.create'
      ]);

      Route::post('create',[
        'uses' => 'PostController@postAdminCreate',
        'as' => 'admin.create'
      ]);

      Route::get('edit/{id}', [
        'uses' => 'PostController@getAdminEdit',
        'as' => 'admin.edit'
      ]);

      Route::get('delete/{id}',[
        'uses' => 'PostController@postAdminDelete',
        'as' => 'admin.delete'
      ]);

      Route::post('edit',[
        'uses' => 'PostController@postAdminUpdate',
        'as' => 'admin.update'
      ]);
});

Auth::routes();

Route::post('/login', [
    'uses' => 'SigninController@signin',
    'as' => 'auth.signin'
  ]);
