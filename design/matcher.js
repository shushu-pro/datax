let info;

info = 'aa';
// Z₁Z₂ (A₁A₂) B₁ | B₂C₁

info = `
  @groupMatcher{
    @logic 'or'
    @suffix [1,0]
    @children (:
      @ [
        @groupMatcher{
          @logic 'and'
          @suffix [1,0]
          @children (:
            @ [
              @linkMatcher Z₁
              @linkMatcher Z₂
              @groupMatcher{
                @logic 'and'
                @suffix [1,0]
                @children (:
                  @ [
                    @linkMatcher A₁
                    @linkMatcher A₂
                  ]
                :)
              }
              @linkMatcher B₁
            ]
          :)
        }
        @groupMatcher{
          @logic 'and'
          @children (:
            @ [
              @linkMatcher B₂
              @linkMatcher C₁
            ]  
          :)
        }
        
      ] 
    :)
  }
`;

info = `
  @groupMatcher{
    @children (:
      @ [
        @linkMatcher{
          @name Z₁
          @suffix [1, 0]
        }
        @linkMatcher{
          @name Z₂
          @suffix [1, 0]
        }
        @linkMatcher{
          @name Z₃
          @suffix [1, 0]
        }

        @groupMatcher{}

        @groupMatcher{}
      ]  
    :)
  }
`;

// ( Z₁Z₂Z₃(A₁A₂A₃){3} | (B₁B₂B₃){1,4}C₁C₂C₃+ )+

info = `
  @matcher{
  


    @groupMatcher{
      @suffix [1, Infinity]
      @logic 'or'
      @children (:
        @ [
          @groupMatcher{ /// groupA
            @suffix [3, Infinity]
            @logic 'and'
            @children (:
              @ [
                @linkMatcher{
                  @name A₁
                  @suffix [1, Infinity]
                }
                @linkMatcher{
                  @name A₂
                  @suffix [1, Infinity]
                }
                @linkMatcher{
                  @name A₃
                  @suffix [1, Infinity]
                }
              ]
            :)
          }

          @groupMatcher{
            @suffix [1,0]
            @logic 'and'
            @children (:
              @groupMatcher{ /// groupB
                @suffix [1, 4]
                @logic 'and'
                @children (:
                  @ [
                    @linkMatcher{
                      @name B₁
                      @suffix [1, Infinity]
                    }
                    @linkMatcher{
                      @name B₂
                      @suffix [1, Infinity]
                    }
                    @linkMatcher{
                      @name B₃
                      @suffix [1, Infinity]
                    }
                  ]
                :)
              }
              @linkMatcher{
                @name C₁
                @suffix [1, 0]
              }
              @linkMatcher{
                @name C₂
                @suffix [1, 0]
              }
              @linkMatcher{
                @name C₃
                @suffix [1, Infinity]
              }
            :)
          }
        ]
      :)

    }  
  }


`;
// ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉

export { info };
