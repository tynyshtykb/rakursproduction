(function () {
    const e = React.createElement;
    const useEffect = React.useEffect;
    const useMemo = React.useMemo;
    const useRef = React.useRef;
    const useState = React.useState;

    const vignettes = [
        {
            id: '11-class',
            title: '11 сынып',
            subtitle: 'Муқаба • 1 разворот • 2 разворот • Артқы муқаба',
            pages: ['img/vin2.jpeg', 'img/vin3.jpeg', 'img/vin4.jpeg', 'img/vin5.jpeg']
        },
        {
            id: '9-class',
            title: '9 сынып',
            subtitle: 'Муқаба • 1 разворот • 2 разворот • Артқы муқаба',
            pages: ['img/vin6.jpeg', 'img/vin8.jpeg', 'img/vin7.jpeg', 'img/vin9.jpeg']
        },
        {
            id: 'young',
            title: 'Жас түлектерге',
            subtitle: 'Муқаба • 1 разворот • 2 разворот • Артқы муқаба',
            pages: ['img/vin12.jpeg', 'img/vin13.jpeg', 'img/vin14.jpeg', 'img/vin15.jpeg']
        },
        {
            id: 'primary',
            title: 'Бастауышпен қоштасу',
            subtitle: 'Муқаба • 1 разворот • 2 разворот • Артқы муқаба',
            pages: ['img/vin20.jpeg', 'img/vin21.jpeg', 'img/vin22.jpeg', 'img/vin25.jpeg']
        },
        {
            id: 'kindergarten',
            title: 'Бала-бақшамен қоштасу',
            subtitle: 'Муқаба • 1 разворот • 2 разворот • Артқы муқаба',
            pages: ['img/vin16.jpeg', 'img/vin17.jpeg', 'img/vin18.jpeg', 'img/vin19.jpeg']
        }
    ];

    function VignetteCard(props) {
        return e(
            'button',
            {
                type: 'button',
                className: 'vf-card' + (props.active ? ' is-active' : ''),
                onClick: props.onClick
            },
            e('div', { className: 'vf-card-title' }, props.title),
            e('div', { className: 'vf-card-sub' }, props.subtitle)
        );
    }

    function ViewerToolbar(props) {
        return e(
            'div',
            { className: 'vf-header' },
            e(
                'div',
                { className: 'vf-header-left' },
                e('h3', null, props.title),
                e('p', null, 'Бет ' + props.current + ' / ' + props.total)
            ),
            e(
                'div',
                { className: 'vf-header-right' },
                e(
                    'button',
                    { type: 'button', className: 'vf-icon-btn', 'aria-label': 'Алдыңғы бет', onClick: props.onPrev },
                    e('i', { className: 'fa-solid fa-chevron-left', 'aria-hidden': 'true' })
                ),
                e(
                    'button',
                    { type: 'button', className: 'vf-icon-btn', 'aria-label': 'Келесі бет', onClick: props.onNext },
                    e('i', { className: 'fa-solid fa-chevron-right', 'aria-hidden': 'true' })
                ),
                e(
                    'button',
                    { type: 'button', className: 'vf-icon-btn', 'aria-label': 'Zoom', onClick: props.onZoom },
                    e('i', { className: 'fa-solid fa-magnifying-glass-plus', 'aria-hidden': 'true' })
                ),
                e(
                    'button',
                    { type: 'button', className: 'vf-icon-btn', 'aria-label': 'Fullscreen', onClick: props.onFullscreen },
                    e('i', { className: 'fa-solid fa-expand', 'aria-hidden': 'true' })
                ),
                e(
                    'button',
                    { type: 'button', className: 'vf-icon-btn', 'aria-label': 'Жабу', onClick: props.onClose },
                    e('i', { className: 'fa-solid fa-xmark', 'aria-hidden': 'true' })
                )
            )
        );
    }

    function FlipBookViewer(props) {
        const containerRef = useRef(null);
        const shellRef = useRef(null);
        const pageFlipRef = useRef(null);
        const pointerStart = useRef({ x: 0, y: 0 });
        const [pageNumber, setPageNumber] = useState(1);
        const [totalPages, setTotalPages] = useState(props.pages.length);
        const [zoomed, setZoomed] = useState(false);
        const [loadedCount, setLoadedCount] = useState(0);
        const [tilt, setTilt] = useState({ x: 0, y: 0 });

        useEffect(function () {
            setLoadedCount(0);
            setPageNumber(1);
            setTotalPages(props.pages.length);
            setZoomed(false);
        }, [props.templateId, props.pages.length]);

        useEffect(function () {
            if (!props.isOpen || !containerRef.current || !window.St || !window.St.PageFlip) {
                return;
            }

            if (pageFlipRef.current) {
                pageFlipRef.current.destroy();
                pageFlipRef.current = null;
            }

            const flip = new window.St.PageFlip(containerRef.current, {
                width: 760,
                height: 980,
                minWidth: 280,
                minHeight: 380,
                maxWidth: 1280,
                maxHeight: 1560,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: false,
                swipeDistance: 38,
                useMouseEvents: true,
                drawShadow: true,
                flippingTime: 980,
                startPage: 0,
                autoSize: true
            });

            const pages = containerRef.current.querySelectorAll('.vf-page');
            flip.loadFromHTML(pages);
            setTotalPages(flip.getPageCount());

            flip.on('flip', function (evt) {
                setPageNumber(evt.data + 1);
            });

            pageFlipRef.current = flip;

            return function () {
                if (pageFlipRef.current) {
                    pageFlipRef.current.destroy();
                    pageFlipRef.current = null;
                }
            };
        }, [props.isOpen, props.templateId, props.pages]);

        useEffect(function () {
            if (!props.apiRef) {
                return;
            }
            props.apiRef.current = {
                next: function () {
                    if (pageFlipRef.current) {
                        pageFlipRef.current.flipNext();
                    }
                },
                prev: function () {
                    if (pageFlipRef.current) {
                        pageFlipRef.current.flipPrev();
                    }
                },
                reset: function () {
                    if (pageFlipRef.current) {
                        pageFlipRef.current.flip(0);
                    }
                    setPageNumber(1);
                }
            };
        }, [props.apiRef, props.templateId]);

        const onPointerDown = function (event) {
            pointerStart.current = { x: event.clientX, y: event.clientY };
        };

        const onPointerUp = function (event) {
            const dx = event.clientX - pointerStart.current.x;
            const dy = event.clientY - pointerStart.current.y;
            if (Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy)) {
                return;
            }
            if (!pageFlipRef.current) {
                return;
            }
            if (dx < 0) {
                pageFlipRef.current.flipNext();
            } else {
                pageFlipRef.current.flipPrev();
            }
        };

        const onMouseMove = function (event) {
            if (!shellRef.current || window.matchMedia('(hover: none)').matches) {
                return;
            }
            const bounds = shellRef.current.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            setTilt({ x: (0.5 - y) * 5, y: (x - 0.5) * 7 });
        };

        const onMouseLeave = function () {
            setTilt({ x: 0, y: 0 });
        };

        const onFullscreen = async function () {
            const target = document.querySelector('.vf-modal');
            if (!target || !target.requestFullscreen) {
                return;
            }
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                } else {
                    await target.requestFullscreen();
                }
            } catch (_err) {
                
            }
        };

        const loadedReady = loadedCount >= Math.min(2, props.pages.length);

        return e(
            React.Fragment,
            null,
            e(ViewerToolbar, {
                title: props.title,
                current: pageNumber,
                total: totalPages,
                onPrev: props.onPrev,
                onNext: props.onNext,
                onZoom: function () {
                    setZoomed(function (prev) {
                        return !prev;
                    });
                },
                onFullscreen: onFullscreen,
                onClose: props.onClose
            }),
            e(
                'div',
                { className: 'vf-viewer-stage', onPointerDown: onPointerDown, onPointerUp: onPointerUp },
                e(
                    'button',
                    { type: 'button', className: 'vf-arrow', 'aria-label': 'Алдыңғы бет', onClick: props.onPrev },
                    e('i', { className: 'fa-solid fa-angle-left', 'aria-hidden': 'true' })
                ),
                e(
                    'div',
                    { className: 'vf-book-shell', ref: shellRef, onMouseMove: onMouseMove, onMouseLeave: onMouseLeave },
                    !loadedReady ? e('div', { className: 'vf-loading' }, 'Жүктелуде...') : null,
                    e(
                        'div',
                        {
                            className: 'vf-book-wrap' + (zoomed ? ' is-zoomed' : ''),
                            style: {
                                '--vf-tilt-x': tilt.x.toFixed(2) + 'deg',
                                '--vf-tilt-y': tilt.y.toFixed(2) + 'deg'
                            }
                        },
                        e(
                            'div',
                            { ref: containerRef },
                            props.pages.map(function (src, index) {
                                return e(
                                    'div',
                                    { className: 'vf-page', key: props.templateId + '-' + index },
                                    e(
                                        'div',
                                        { className: 'vf-page-inner' },
                                        e('img', {
                                            src: src,
                                            alt: props.title + ' page ' + (index + 1),
                                            loading: 'lazy',
                                            onLoad: function () {
                                                setLoadedCount(function (prev) {
                                                    return prev + 1;
                                                });
                                            }
                                        })
                                    )
                                );
                            })
                        )
                    )
                ),
                e(
                    'button',
                    { type: 'button', className: 'vf-arrow', 'aria-label': 'Келесі бет', onClick: props.onNext },
                    e('i', { className: 'fa-solid fa-angle-right', 'aria-hidden': 'true' })
                )
            ),
            e(
                'div',
                { className: 'vf-footer' },
                e('span', { className: 'vf-counter' }, 'Бет ' + pageNumber + ' / ' + totalPages),
                e('span', null, 'Desktop: click/drag • Mobile: swipe')
            )
        );
    }

    function VignetteSection(props) {
        const activeTemplate = useMemo(function () {
            return vignettes.find(function (item) {
                return item.id === props.activeId;
            }) || vignettes[0];
        }, [props.activeId]);

        const viewerApiRef = useRef(null);

        const onPrev = function () {
            if (viewerApiRef.current) {
                viewerApiRef.current.prev();
            }
        };

        const onNext = function () {
            if (viewerApiRef.current) {
                viewerApiRef.current.next();
            }
        };

        return e(
            'div',
            { className: 'vf-body' },
            e(
                'div',
                { className: 'vf-cards' },
                vignettes.map(function (item) {
                    return e(VignetteCard, {
                        key: item.id,
                        active: item.id === activeTemplate.id,
                        title: item.title,
                        subtitle: item.subtitle,
                        onClick: function () {
                            props.onSelect(item.id);
                        }
                    });
                })
            ),
            e(FlipBookViewer, {
                isOpen: props.isOpen,
                title: activeTemplate.title,
                templateId: activeTemplate.id,
                pages: activeTemplate.pages,
                onPrev: onPrev,
                onNext: onNext,
                onClose: props.onClose,
                apiRef: viewerApiRef
            })
        );
    }

    function FlipBookModal(props) {
        return e(
            'div',
            {
                className: 'vf-overlay' + (props.open ? ' is-open' : ''),
                onClick: function (event) {
                    if (event.target === event.currentTarget) {
                        props.onClose();
                    }
                }
            },
            e(
                'div',
                { className: 'vf-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Виньетка flipbook viewer' },
                e(VignetteSection, {
                    isOpen: props.open,
                    activeId: props.activeId,
                    onSelect: props.onSelect,
                    onClose: props.onClose
                })
            )
        );
    }

    function App(props) {
        const [open, setOpen] = useState(false);
        const [activeId, setActiveId] = useState(vignettes[0].id);

        useEffect(function () {
            if (open) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
            return function () {
                document.body.classList.remove('no-scroll');
            };
        }, [open]);

        useEffect(function () {
            const onEsc = function (event) {
                if (event.key === 'Escape') {
                    setOpen(false);
                }
            };
            const onGlobalOpen = function (event) {
                if (event.detail && event.detail.templateId) {
                    setActiveId(event.detail.templateId);
                }
                setOpen(true);
            };
            document.addEventListener('keydown', onEsc);
            document.addEventListener('vignette:open', onGlobalOpen);
            return function () {
                document.removeEventListener('keydown', onEsc);
                document.removeEventListener('vignette:open', onGlobalOpen);
            };
        }, []);

        useEffect(function () {
            if (props.apiRef) {
                props.apiRef.open = function (templateId) {
                    if (templateId) {
                        setActiveId(templateId);
                    }
                    setOpen(true);
                };
                props.apiRef.close = function () {
                    setOpen(false);
                };
            }
        }, [props.apiRef]);

        return e(FlipBookModal, {
            open: open,
            activeId: activeId,
            onSelect: setActiveId,
            onClose: function () {
                setOpen(false);
            }
        });
    }

    window.VignetteViewerApp = {
        init: function () {
            const mount = document.getElementById('vignette-react-root');
            if (!mount || !window.React || !window.ReactDOM) {
                return null;
            }

            const apiRef = {};
            const root = window.ReactDOM.createRoot(mount);
            root.render(e(App, { apiRef: apiRef }));

            return {
                open: function (templateId) {
                    if (apiRef.open) {
                        apiRef.open(templateId);
                    }
                },
                close: function () {
                    if (apiRef.close) {
                        apiRef.close();
                    }
                }
            };
        }
    };
})();
