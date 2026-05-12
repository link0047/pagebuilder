<div class="build-card-skeleton">
  <div class="skeleton skeleton--title"></div>
  <div class="skeleton skeleton--badge"></div>
  <div class="build-card-skeleton__meta">
    <div class="skeleton skeleton--avatar"></div>
    <div class="skeleton skeleton--meta-text"></div>
  </div>
  <div class="build-card-skeleton__footer">
    <div class="skeleton skeleton--button"></div>
    <div class="skeleton skeleton--dots"></div>
  </div>
</div>

<style>
  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .skeleton {
    background: #e8e8e8;
    border-radius: 0.25rem;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .build-card-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
  }

  .skeleton--title {
    height: 1.25rem;
    width: 65%;
  }

  .skeleton--badge {
    height: 1.5rem;
    width: 4rem;
    border-radius: 9999px;
  }

  .build-card-skeleton__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skeleton--avatar {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .skeleton--meta-text {
    height: 0.875rem;
    width: 55%;
  }

  .build-card-skeleton__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ebebeb;
    padding-top: 0.75rem;
  }

  .skeleton--button {
    height: 2rem;
    width: 5rem;
    border-radius: 0.5rem;
  }

  .skeleton--dots {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
</style>
