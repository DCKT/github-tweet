chrome.extension.sendMessage({}, function (response) {
	const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval)
      const isRepo = document.getElementById('js-repo-pjax-container')

      if (!isRepo) {
        return
      }

      const repoName = encodeURIComponent(document.querySelector('[itemprop="name"]').innerText)
      const repoDescription = encodeURIComponent(document.querySelector('[itemprop="about"]').innerText)
      const repoUrl = encodeURIComponent(location.href)
      const tweetText = `${repoName} - ${repoDescription} ${repoUrl}`
      const pageHeadActions = document.querySelector('.pagehead-actions')
      const tweetTag = document.createElement('li')

      tweetTag.innerHTML = `
        <a target='_blank' class='twitter-share-button' href='https://twitter.com/intent/tweet?text=${tweetText}'>
          <img width='28' src='data:image/png;base64,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' alt='Tweet' />
        </a>
      `
      pageHeadActions.appendChild(tweetTag)
    }
	}, 10)
})
