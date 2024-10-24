---
title: After Beginner Advice
---

These are a couple thoughts about what to do after you've been programming for a bit/me looking back on my relatively brief experience with programming in general.

Mostly related to the age old question of 'what language/framework should I use?'

As a bit of context, when I was starting out, I pretty much used Python for most things. I don't think I was ever an evangelist, but if I had to do something I would reach for Python, even if (now, in hindsight) it wasn't really the best choice. I have been bit by a lot of the stereotypes people complain about ([dealing with the GIL](https://wiki.python.org/moin/GlobalInterpreterLock), multi threading (though, this is [not](https://docs.python.org/3/library/concurrent.futures.html#module-concurrent.futures) as [terrible](https://docs.python.org/3/library/multiprocessing.shared_memory.html) as it once was), memory usage on long running processes, dealing with Python environments/versions/packages, the lack of types (I use [mypy](https://mypy.readthedocs.io/en/stable/) and runtime assertions heavily nowadays), I could go on...)

And yes, those are all still downsides, but for prototyping, dealing with the _mess_ that is CSV files, creating some quick graphs, or a quick/dirty script/CLI tool that can leverage some library on [pypi](https://pypi.org/), Python is still ~~great~~ good enough. This is probably half familiarity bias and half Python actually being decent to just get stuff done in.

In my experience, anyone who says there are no downsides or trade-offs in a language has not been using it long enough, are being paid to say so, or they're so far abstracted away from the true problems by frameworks. To quote the classic: "There are only two kinds of languages: the ones people complain about and the ones nobody uses." - Bjarne Stroustrup

I think its useful to get _really good_ at one programming language. This is not to say you should _just learn one language_, but you should learn the internals of how stuff works in at least one. By that I mean complex bits like module loading/imports, string/binary buffers/manipulation, error handling, dealing with dates, dealing with databases, serialization formats/parsing files, concurrency - things that lots of people need to do, and are very opinionated about.

It is my opinion that acquiring this level of knowledge into a programming language will eventually make you dislike parts of it -- and I think that is fine! There are pros and cons everywhere, and its useful to know those and choose the correct tool to solve your problem. I think learning one language very deeply lets you appreciate this much more - you're more aware about possible issues that one might run into, and gain some amount of healthy skepticism when trying new things that claim they can solve every problem you have (spoiler: they typically can't...).

As time went on, I learned more about using the command line, and generally [expanded my general knowledge of other programming languages](https://github.com/purarue/poly-project-euler) I have started using other programming languages when it made sense to - [in perl](https://github.com/purarue/pmark), because it could use PERLs extensive regex functionality well, in rust, [to use pest.rs](https://pest.rs/), some in golang [for tiny CLIs](https://github.com/purarue/newest), or because [I just wanted a quick HTTP server](https://github.com/purarue/server_clipboard) and its standard library is great for that.

Is easy to say 'pick the correct language for the tool', but its not easy to know what the correct thing is unless you've played around with lots of them. I don't think reading tutorials or coding bootcamps are going to give you the intuition - pick some language/library that looks cool that you've never used, and create some toy example or little tool for yourself, and eventually all these little side projects give you knowledge/intuition.

There's also some benefit to doing different types of programming. If all you've ever done is websites, try making a CLI tool. Or a little game, or a GUI application, or anything really that you're not used to, [just pick something](https://github.com/practical-tutorials/project-based-learning)

### Frameworks

I am not against frameworks or against a particular language, I am generally against the idea that you have to use one language or framework to solve every problem. All frameworks eventually die, languages fall out of favor. If you're lucky, [your code will survive long enough to be technical debt to someone else](https://blog.visionarycto.com/p/my-20-year-career-is-technical-debt)

Frameworks are very useful, but its also useful to know what's going on so when things break you sort of understand why. Its the same as programming languages - try lots of frameworks, try building things or reimplementing small parts of frameworks so you understand the problems they're trying to solve. Eventually, you start to see similar sorts of patterns or ways frameworks solve problems, and you get an intuition about things instead of just falling into the hype cycle once every 4 years
