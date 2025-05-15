/**
 * AI Text Detector - Interactive Frontend
 * Enhanced interactive features for the Bulma-based UI
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loadingText = document.getElementById('loadingText');
    const resultCard = document.getElementById('resultCard');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultTimestamp = document.getElementById('resultTimestamp');
    const textPreview = document.getElementById('textPreview');
    const resultContent = document.getElementById('resultContent');
    const humanProgress = document.getElementById('humanProgress');
    const aiProgress = document.getElementById('aiProgress');
    const humanPercent = document.getElementById('humanPercent');
    const aiPercent = document.getElementById('aiPercent');
    const clearTextBtn = document.getElementById('clearTextBtn');
    const dropArea = document.getElementById('dropArea');
    
    // Create history tab and button
    createHistoryTab();
    
    // Initialize Word Counter
    const wordCountContainer = document.createElement('div');
    wordCountContainer.className = 'has-text-right mt-2 has-text-grey is-size-7';
    wordCountContainer.innerHTML = 'Words: 0 <span class="tag is-light ml-2">Minimum 500 words recommended</span>';
    textInput.parentNode.appendChild(wordCountContainer);
    
    // Tab switching
    const tabs = document.querySelectorAll('#input-tabs li');
    const tabContents = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Set active tab
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            
            // Show target content
            tabContents.forEach(content => {
                content.style.display = 'none';
                if (content.id === target) {
                    content.style.display = 'block';
                    // Add subtle entrance animation
                    content.classList.add('fade-in');
                    setTimeout(() => content.classList.remove('fade-in'), 500);
                    
                    // Load history if history tab is selected
                    if (target === 'history') {
                        loadHistoryItems();
                    }
                }
            });
        });
    });
    
    // Mobile menu toggle
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('.navbar-menu');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
    
    // Word counter
    textInput.addEventListener('input', function() {
        const text = this.value.trim();
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        
        // Update word count
        let recommendation = '';
        if (wordCount < 500) {
            recommendation = '<span class="tag is-warning ml-2">Minimum 500 words recommended</span>';
        } else if (wordCount >= 500 && wordCount < 1500) {
            recommendation = '<span class="tag is-info ml-2">Good length</span>';
        } else {
            recommendation = '<span class="tag is-success ml-2">Excellent length</span>';
        }
        
        wordCountContainer.innerHTML = `Words: ${wordCount} ${recommendation}`;
        
        // Update analyze button state
        if (wordCount > 0) {
            analyzeBtn.classList.add('pulse');
            setTimeout(() => analyzeBtn.classList.remove('pulse'), 2000);
        } else {
            analyzeBtn.classList.remove('pulse');
        }
    });
    
    // Clear text button
    clearTextBtn.addEventListener('click', () => {
        textInput.value = '';
        textInput.focus();
        wordCountContainer.innerHTML = 'Words: 0 <span class="tag is-light ml-2">Minimum 500 words recommended</span>';
        analyzeBtn.classList.remove('pulse');
    });
    
    // Example texts
    const exampleTexts = {
        human: "The perspective of my father consistently challenges me. He lives in Missouri and does not believe the government should issue mask mandates and that as long as we take vitamins we will be alright. He believes that the government is trying to manipulate the general public with restrictions that neglect the individual freedoms of the people. I, on the other hand, believe that mask mandates are essential to ensure that the general public is better protected. He wanted me to visit him in Missouri for our usual slate of activities—the State Fair, ComicCon, water park, and World War II museum—and I wasn't sure what to do: I wanted to make good on my plans with my dad, but also wanted to stay true to what I knew was right. In the end, I decided to go and see him, but laid out clear rules and conditions that would make me comfortable. Personal relationships are important to me, and I want to maintain a connection with my dad despite the fact that we live far away from each other and it is hard for us to accept our differences in ideas. At the same time, I needed to draw healthy boundaries that would make me feel comfortable and respected. I'm invested in public health, and want to be a model of doing the right thing, even if it would have been a blast to whoop my dad's butt in the Magic the Gathering tournament at Comic Con. I probably argue with my grandfather more than I do with most other people combined. It's not because we're at odds. We just have different perspectives, influenced by our experiences—his as a life-long resident of India, mine as a first-generation American. One pretty common argument we have is over Eastern vs. Western medicine. My solution to a headache, for example, is to take Advil. His is to rub Tiger Balm on his forehead and coconut oil on the soles of his feet. I try to convince him of the benefits of taking a nonsteroidal anti-inflammatory, describing how it can reduce inflammation by blocking the production of certain chemicals. He tries to convince me that the balm creates a cooling effect, distracting the brain from pain and relaxing the muscles. Rather than becoming sore at or resentful of each other, we've grown closer through these debates, and I've learned how to disagree without letting the situation get acrimonious. Through these interactions, I've learned that a discussion shouldn't be confrontational. The purpose isn't to win, but to share my knowledge with the other party and learn from them as well. So rather than saying, 'Rubbing balm on your forehead is stupid; you should just take Advil,' I say, 'While rubbing balm on your forehead seems to work, I've noticed that taking an Advil has a stronger and more immediate effect.' Respecting the opposing party makes them more willing to hear you out.",
        ai: "The concept of sustainable development has evolved significantly over the past few decades, transitioning from a niche environmental concern to a mainstream policy priority. In examining this evolution, it becomes apparent that economic, social, and environmental factors must be considered in tandem, rather than as isolated domains. My personal experience working with community gardens in urban areas has shown that successful sustainability initiatives require grassroots participation alongside institutional support. The residents I've collaborated with often bring practical knowledge that technical experts miss, creating a synergy that produces more effective and lasting solutions. This observation aligns with research suggesting that multistakeholder approaches yield the most robust sustainability outcomes. However, challenges remain in balancing immediate economic needs with long-term environmental protection, particularly in developing regions where resources are limited. The tension between these priorities continues to shape how we conceptualize and implement sustainable development globally.",
        mixed: "I woke up this morning thinking about what a phenomenal year 2009 was for me. It was full of ups and downs, but interestingly enough, it was the downs that fueled the ups. The most significant thing that happened to me is that I discovered something about myself that I never expected. I LOVE to write. Absolutely love it. If you're wondering how I could get this far in life without knowing this about myself, join the club. I've written plenty of stuff over the years as part of various jobs I've held. But it was always what I needed to write for someone else. Technical guides, sales brochures, reports, business proposals and letters…it was always for some other purpose than my own. Writing fiction is different, because I'm doing it for myself. I can let the story and characters take me wherever they go. When I close my laptop at the end of a session, the satisfaction and wonder that I feel astonishes me. The next day when I review and edit, I frequently feel amazed that these words came from me. Don't get me wrong. I know my writing skill needs development. But occasionally I'll look at a phrase or a scene and think, 'Wow. That's really good.' And that's what keeps me going. The hope that I can feel more of those moments, and that my readers will feel them as well. My biggest fear is that I won't do justice to the characters that give me their stories. So I'm studying, practicing, reading, attending workshops – everything I can do to become a better writer. I owe it to the characters in my stories because they helped me discover this precious gift of creativity."
    };
    
    // Set up example buttons
    const exampleButtons = document.querySelectorAll('.example-button');
    if (exampleButtons.length > 0) {
        exampleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const exampleType = this.dataset.example;
                if (textInput && exampleTexts[exampleType]) {
                    textInput.value = exampleTexts[exampleType];
                    
                    // Trigger word count update
                    textInput.dispatchEvent(new Event('input'));
                    
                    // Switch to paste text tab with animation
                    const pasteTextTab = document.querySelector('[data-tab="paste-text"]');
                    if (pasteTextTab) {
                        pasteTextTab.click();
                    }
                    
                    // Add visual feedback
                    button.classList.add('is-loading');
                    setTimeout(() => button.classList.remove('is-loading'), 500);
                } else {
                    console.error('Text input element or example text not found');
                }
            });
        });
    } else {
        console.warn('No example buttons found');
    }
    
    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                fileName.textContent = 'Selected: ' + file.name;
                dropArea.classList.add('has-text-primary');
                
                // Visual confirmation
                dropArea.innerHTML += '<div class="notification is-primary is-light mt-4 file-selected-notification">File selected successfully!</div>';
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    const notification = document.querySelector('.file-selected-notification');
                    if (notification) {
                        notification.remove();
                    }
                }, 3000);
                
                // Clear text input when file is selected
                if (textInput) textInput.value = '';
                
                // Update analyze button
                analyzeBtn.classList.add('pulse');
                setTimeout(() => analyzeBtn.classList.remove('pulse'), 2000);
            }
        });
    }
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        if (dropArea) {
            dropArea.addEventListener(eventName, preventDefaults, false);
        }
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        if (dropArea) {
            dropArea.addEventListener(eventName, highlight, false);
        }
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        if (dropArea) {
            dropArea.addEventListener(eventName, unhighlight, false);
        }
    });
    
    function highlight() {
        if (dropArea) {
            dropArea.classList.add('is-dragover');
        }
    }
    
    function unhighlight() {
        if (dropArea) {
            dropArea.classList.remove('is-dragover');
        }
    }
    
    if (dropArea) {
        dropArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0 && fileInput) {
                fileInput.files = files;
                if (fileName) {
                    fileName.textContent = 'Selected: ' + files[0].name;
                }
                dropArea.classList.add('has-text-primary');
                
                // Visual confirmation
                const existingNotification = document.querySelector('.file-selected-notification');
                if (existingNotification) existingNotification.remove();
                
                dropArea.innerHTML += '<div class="notification is-primary is-light mt-4 file-selected-notification">File dropped successfully!</div>';
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    const notification = document.querySelector('.file-selected-notification');
                    if (notification) {
                        notification.remove();
                    }
                }, 3000);
                
                // Update analyze button
                if (analyzeBtn) {
                    analyzeBtn.classList.add('pulse');
                    setTimeout(() => analyzeBtn.classList.remove('pulse'), 2000);
                }
            }
        });
    }
    
    // Create typing indicator
    function createTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        return typingIndicator;
    }
    
    // Handle analysis button click
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            // Validate input
            let hasInput = false;
            let activeTab = document.querySelector('#input-tabs li.is-active')?.dataset.tab;
            
            if (activeTab === 'paste-text') {
                hasInput = textInput && textInput.value.trim() !== '';
                if (!hasInput) {
                    showNotification('Please enter some text to analyze.', 'is-danger');
                    if (textInput) textInput.focus();
                    return;
                }
            } else if (activeTab === 'upload-file') {
                hasInput = fileInput && fileInput.files && fileInput.files.length > 0;
                if (!hasInput) {
                    showNotification('Please select a file to analyze.', 'is-danger');
                    return;
                }
            } else if (activeTab === 'try-examples') {
                // For examples tab, we need to have loaded an example
                if (!textInput || textInput.value.trim() === '') {
                    showNotification('Please select an example to analyze.', 'is-danger');
                    return;
                }
                hasInput = true;
            }
            
            if (!hasInput) {
                showNotification('Please provide text to analyze.', 'is-danger');
                return;
            }
            
            // Button loading state
            analyzeBtn.classList.add('is-loading');
            
            // Show loading indicators
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (loadingText) {
                loadingText.classList.remove('is-hidden');
                // Add typing indicator next to loading text
                loadingText.appendChild(createTypingIndicator());
            }
            
            if (resultCard) resultCard.style.display = 'none';
            
            // Create form data
            const formData = new FormData();
            
            if (textInput && textInput.value.trim() !== '') {
                formData.append('text', textInput.value);
            } else if (fileInput && fileInput.files && fileInput.files.length > 0) {
                formData.append('file', fileInput.files[0]);
            }
            
            // Send request to server
            fetch('/classify', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Hide loading indicators
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (loadingText) {
                    loadingText.innerHTML = 'Analyzing text...';
                    loadingText.classList.add('is-hidden');
                }
                analyzeBtn.classList.remove('is-loading');
                
                if (data.error) {
                    showNotification(data.error, 'is-danger');
                    return;
                }
                
                // Save to history
                saveToHistory(data);
                
                // Update result UI
                updateResultUI(data);
                
                // Show result card with animation
                if (resultCard) {
                    resultCard.style.display = 'block';
                    resultCard.classList.add('fade-in');
                    
                    // Scroll to results
                    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            })
            .catch(error => {
                // Hide loading indicators
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (loadingText) {
                    loadingText.innerHTML = 'Analyzing text...';
                    loadingText.classList.add('is-hidden');
                }
                analyzeBtn.classList.remove('is-loading');
                
                showNotification('Error: ' + error.message, 'is-danger');
            });
        });
    }
    
    // Function to update result UI
    function updateResultUI(data) {
        const result = data.result;
        const confidence = data.confidence;
        
        // Set result title and message
        resultTitle.textContent = result + ' Written Text';
        resultMessage.textContent = `This text was ${result === 'Human' ? 'likely written by a human' : 'likely generated by AI'}.`;
        resultTimestamp.textContent = `Analysis completed on ${data.timestamp}`;
        
        // Update result icon and class
        const iconElement = resultContent.querySelector('.result-icon i');
        if (result === 'Human') {
            iconElement.className = 'fas fa-user';
            resultContent.classList.add('is-human');
            resultContent.classList.remove('is-ai');
            
            // Add human result styling to box
            resultCard.querySelector('.box').classList.add('is-human-result');
            resultCard.querySelector('.box').classList.remove('is-ai-result');
        } else {
            iconElement.className = 'fas fa-robot';
            resultContent.classList.add('is-ai');
            resultContent.classList.remove('is-human');
            
            // Add AI result styling to box
            resultCard.querySelector('.box').classList.add('is-ai-result');
            resultCard.querySelector('.box').classList.remove('is-human-result');
        }
        
        // Animate progress bars with delay for visual effect
        setTimeout(() => {
            // Update progress bars with animation
            if (result === 'Human') {
                humanProgress.style.width = confidence + '%';
                aiProgress.style.width = (100 - confidence) + '%';
            } else {
                humanProgress.style.width = (100 - confidence) + '%';
                aiProgress.style.width = confidence + '%';
            }
            
            // Update percentage tags
            humanPercent.textContent = `Human: ${result === 'Human' ? confidence : 100 - confidence}%`;
            aiPercent.textContent = `AI: ${result === 'AI' ? confidence : 100 - confidence}%`;
        }, 300);
        
        // Update text preview with fancy highlight effect
        textPreview.innerHTML = '';  // Clear previous content
        
        // Add text with highlight animation
        const textWrapper = document.createElement('div');
        textWrapper.className = 'content';
        textWrapper.textContent = data.text_preview;
        textPreview.appendChild(textWrapper);
    }
    
    // Notification helper
    function showNotification(message, type = 'is-info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification-message');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type} notification-message`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.maxWidth = '300px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        notification.style.borderRadius = '6px';
        notification.style.animation = 'fadeInRight 0.5s';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'delete';
        closeButton.addEventListener('click', () => notification.remove());
        
        notification.appendChild(closeButton);
        notification.appendChild(document.createTextNode(message));
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'fadeOutRight 0.5s';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // Add keypress handler for analyze (Ctrl+Enter)
    textInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.keyCode === 13) {
            analyzeBtn.click();
        }
    });
    
    // Add animations to heroes and buttons on page load
    window.addEventListener('load', function() {
        // Add subtle entrance animations for the hero
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                hero.style.transition = 'all 0.8s ease-out';
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Add tooltips for better UX
        addTooltip(analyzeBtn, 'Analyze the text to determine if it was written by a human or AI (Ctrl+Enter)');
        addTooltip(clearTextBtn, 'Clear text field');
    });
    
    // Tooltip helper
    function addTooltip(element, text) {
        element.classList.add('tooltip');
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = text;
        element.appendChild(tooltip);
    }
    
    // Add animation effects for better UX
    document.querySelectorAll('.box, .button').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(30px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // History functions
    function createHistoryTab() {
        // Add history tab to the tabs list
        const tabsList = document.getElementById('input-tabs');
        const historyTab = document.createElement('li');
        historyTab.dataset.tab = 'history';
        historyTab.innerHTML = `
            <a>
                <span class="icon"><i class="fas fa-history"></i></span>
                <span>History</span>
            </a>
        `;
        tabsList.appendChild(historyTab);
        
        // Create history tab content
        const tabContent = document.querySelector('.tab-content');
        const historyPane = document.createElement('div');
        historyPane.id = 'history';
        historyPane.className = 'tab-pane';
        historyPane.style.display = 'none';
        
        // Initial content for history pane
        historyPane.innerHTML = `
            <div class="box">
                <h3 class="title is-5">Analysis History</h3>
                <p class="subtitle is-6">Your recent text analysis results</p>
                
                <div class="history-actions buttons mb-4">
                    <button id="clearHistoryBtn" class="button is-small is-danger is-light">
                        <span class="icon">
                            <i class="fas fa-trash-alt"></i>
                        </span>
                        <span>Clear History</span>
                    </button>
                </div>
                
                <div id="historyList" class="history-list">
                    <div class="has-text-centered my-6 empty-history">
                        <div class="icon is-large">
                            <i class="fas fa-inbox fa-3x has-text-grey-light"></i>
                        </div>
                        <p class="mt-4 has-text-grey">No analysis history yet</p>
                        <p class="has-text-grey-light is-size-7">Your analysis results will appear here</p>
                    </div>
                </div>
            </div>
        `;
        
        tabContent.appendChild(historyPane);
        
        // Add event listener for clear history button
        setTimeout(() => {
            const clearHistoryBtn = document.getElementById('clearHistoryBtn');
            if (clearHistoryBtn) {
                clearHistoryBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to clear all analysis history?')) {
                        localStorage.removeItem('textAnalysisHistory');
                        loadHistoryItems(); // Refresh the list
                        showNotification('History cleared successfully', 'is-success');
                    }
                });
            }
        }, 100);
    }
    
    function saveToHistory(data) {
        // Get existing history
        let history = JSON.parse(localStorage.getItem('textAnalysisHistory') || '[]');
        
        // Add new result to history (with max of 20 items)
        const historyItem = {
            id: Date.now(),
            timestamp: data.timestamp,
            result: data.result,
            confidence: data.confidence,
            text_preview: data.text_preview
        };
        
        history.unshift(historyItem); // Add to beginning
        
        // Keep only the last 20 items
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // Save back to localStorage
        localStorage.setItem('textAnalysisHistory', JSON.stringify(history));
        
        // Update history tab badge if it exists
        updateHistoryBadge(history.length);
    }
    
    function updateHistoryBadge(count) {
        // Find the history tab
        const historyTab = document.querySelector('[data-tab="history"]');
        if (!historyTab) return;
        
        // Check if badge already exists
        let badge = historyTab.querySelector('.history-badge');
        
        if (count > 0) {
            if (!badge) {
                // Create badge if it doesn't exist
                badge = document.createElement('span');
                badge.className = 'tag is-primary is-rounded history-badge ml-2';
                historyTab.querySelector('a').appendChild(badge);
            }
            badge.textContent = count;
        } else if (badge) {
            // Remove badge if count is 0
            badge.remove();
        }
    }
    
    function loadHistoryItems() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        // Get history from localStorage
        const history = JSON.parse(localStorage.getItem('textAnalysisHistory') || '[]');
        
        // Update badge
        updateHistoryBadge(history.length);
        
        // Clear current list
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            // Show empty state
            historyList.innerHTML = `
                <div class="has-text-centered my-6 empty-history">
                    <div class="icon is-large">
                        <i class="fas fa-inbox fa-3x has-text-grey-light"></i>
                    </div>
                    <p class="mt-4 has-text-grey">No analysis history yet</p>
                    <p class="has-text-grey-light is-size-7">Your analysis results will appear here</p>
                </div>
            `;
            return;
        }
        
        // Add each history item
        history.forEach((item, index) => {
            const isHuman = item.result === 'Human';
            const cardClass = isHuman ? 'is-human-result' : 'is-ai-result';
            const icon = isHuman ? 'fa-user' : 'fa-robot';
            const iconClass = isHuman ? 'has-text-success' : 'has-text-danger';
            
            const historyItem = document.createElement('div');
            historyItem.className = `history-item box ${cardClass} mb-4`;
            historyItem.innerHTML = `
                <div class="columns is-vcentered">
                    <div class="column is-narrow">
                        <span class="icon is-large ${iconClass}">
                            <i class="fas ${icon} fa-2x"></i>
                        </span>
                    </div>
                    <div class="column">
                        <h4 class="title is-6 mb-1">${item.result} Text (${item.confidence}% confidence)</h4>
                        <p class="is-size-7 has-text-grey">${item.timestamp}</p>
                        <div class="text-preview mt-2 p-2 is-size-7 has-background-grey-lighter has-text-grey-dark" style="border-radius:4px;">${item.text_preview}</div>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-small restore-text" data-index="${index}">
                            <span class="icon">
                                <i class="fas fa-redo-alt"></i>
                            </span>
                            <span>Restore</span>
                        </button>
                        <button class="button is-small is-danger is-light delete-item ml-2" data-id="${item.id}">
                            <span class="icon">
                                <i class="fas fa-times"></i>
                            </span>
                        </button>
                    </div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // Add event listeners for restore and delete buttons
        document.querySelectorAll('.restore-text').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const history = JSON.parse(localStorage.getItem('textAnalysisHistory') || '[]');
                if (history[index]) {
                    // Set the text input content to the stored preview
                    textInput.value = history[index].text_preview;
                    
                    // Switch to paste text tab
                    document.querySelector('[data-tab="paste-text"]').click();
                    
                    // Scroll to textarea and focus
                    textInput.scrollIntoView({ behavior: 'smooth' });
                    textInput.focus();
                    
                    // Update word count
                    textInput.dispatchEvent(new Event('input'));
                    
                    showNotification('Text restored from history', 'is-success');
                }
            });
        });
        
        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                let history = JSON.parse(localStorage.getItem('textAnalysisHistory') || '[]');
                
                // Remove the item with matching id
                history = history.filter(item => item.id !== id);
                
                // Save back to localStorage
                localStorage.setItem('textAnalysisHistory', JSON.stringify(history));
                
                // Refresh the list
                loadHistoryItems();
                
                showNotification('History item deleted', 'is-info');
            });
        });
    }
    
    // Initialize history on first load
    loadHistoryItems();
}); 