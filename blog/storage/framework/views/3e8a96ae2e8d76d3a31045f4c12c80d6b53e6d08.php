<?php $__env->startSection('content'); ?>
    <?php if(Session::has('info')): ?>
    <div class="row">
        <div class="col-md-12">
            <p class="alert alert-info"><?php echo e(Session::get('info')); ?></p>
        </div>
    </div>
    <?php endif; ?>
    <div class="row">
        <div class="col-md-12">
            <a href="<?php echo e(route('admin.create')); ?>" class="btn btn-success">New Post</a>
        </div>
    </div>
    <hr>
    <?php $__currentLoopData = $posts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $post): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="row">
            <div class="col-md-12">
                <p><strong><?php echo e($post->title); ?></strong>
                    <a href="<?php echo e(route('admin.edit', ['id' => $post->id])); ?>">Edit</a>
                    <a href="<?php echo e(route('admin.delete', ['id' => $post->id])); ?>">Delete</a>
                </p>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>