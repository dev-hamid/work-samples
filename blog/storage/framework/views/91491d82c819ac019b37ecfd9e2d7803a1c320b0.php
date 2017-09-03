<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <a href="#" class="navbar-brand">Laravel Guide</a>
            <ul class="nav navbar-nav">
                <li><a href="<?php echo e(route('blog.index')); ?>">Blog</a></li>
                <li><a href="<?php echo e(route('other.about')); ?>">About</a></li>
                <?php if(!Auth::check()): ?>
                    <li><a href="<?php echo e(url('/login')); ?>">Login</a></li>
                    <li><a href="<?php echo e(url('/register')); ?>">Register</a></li>
                <?php endif; ?>
                <?php if(Auth::check()): ?>
                    <li ><a href="<?php echo e(route('admin.index')); ?>">Posts</a></li>
                    <li>
                      <a href="<?php echo e(route('logout')); ?>"
                          onclick="event.preventDefault();
                                   document.getElementById('logout-form').submit();">
                          Logout
                      </a>

                      <form id="logout-form" action="<?php echo e(route('logout')); ?>" method="POST" style="display: none;">
                          <?php echo e(csrf_field()); ?>

                      </form>
                    </li>
                <?php endif; ?>


            </ul>
        </div>
    </div>
</nav>
