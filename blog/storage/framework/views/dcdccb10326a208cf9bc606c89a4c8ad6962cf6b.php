<?php $__env->startSection('content'); ?>
    <div class="row">
        <div class="col-md-12">
            <p class="quote"><?php echo e($post->title); ?></p>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <p> <?php echo e(count($post->likes)); ?> Likes |
                <a href="<?php echo e(route('blog.post.like', ['id'=> $post->id])); ?>">Like</a></p>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <p> <?php echo e($post->content); ?> </p>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>